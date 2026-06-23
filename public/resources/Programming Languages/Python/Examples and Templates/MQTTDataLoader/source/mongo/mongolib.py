import json
from datetime import datetime
from threading import Lock
from typing import List
import subprocess
import sys
import pymongo
from bson import ObjectId
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from pymongo.driver_info import DriverInfo
from pymongo import monitoring
import logging

# Mongo Data Loader Exceptions
class MongoDataLoaderException(Exception):
    def __init__(self, message, errorcode):            
        # Call the base class constructor with the parameters it needs
        super().__init__(message)
        self.__errorcode__ = errorcode
    
    def getErrorCode(self):
        return self.__errorcode__
    
class MongoDataLoaderAlreadyClosedException(MongoDataLoaderException):
    def __init__(self, message, errorcode):            
        super().__init__(message=message, errorcode=errorcode)

class MongoDataLoaderOperationTimeoutException(MongoDataLoaderException):
    def __init__(self, message, errorcode):            
        super().__init__(message=message, errorcode=errorcode)

class MongoDataLoaderServerLaunchException(MongoDataLoaderException):
    def __init__(self, message, errorcode):            
        super().__init__(message=message, errorcode=errorcode)

class MongoDataLoaderServerShutdownException(MongoDataLoaderException):
    def __init__(self, message, errorcode):            
        super().__init__(message=message, errorcode=errorcode)

class MongoDataLoaderTestOperationException(MongoDataLoaderException):
    def __init__(self, message, errorcode):            
        super().__init__(message=message, errorcode=errorcode)


class MongoDataLoaderConfigurationException(MongoDataLoaderException):
    def __init__(self, message, errorcode):            
        super().__init__(message=message, errorcode=errorcode)




# Mongo Data Loader Event Listeners
class MongoDBServerListener(monitoring.ServerListener):
    def opened(self, event):
        logging.info("[" + str(self.__module__) + "][" + __name__ + "] Server {0.server_address} added to topology "
                                                             "{0.topology_id}".format(event))

    def description_changed(self, event):
        previous_server_type = event.previous_description.server_type
        new_server_type = event.new_description.server_type
        if new_server_type != previous_server_type:
            # server_type_name was added in PyMongo 3.4
            logging.info(
                "[" + str(self.__module__) + "][" + __name__ + "] Server {0.server_address} changed type from "
                                                               "{0.previous_description.server_type_name} to "
                                                               "{0.new_description.server_type_name}".format(event))

    def closed(self, event):
        logging.info("[" + str(self.__module__) + "][" + __name__ + "] Server {0.server_address} removed from topology "
                                                             "{0.topology_id}".format(event))

class MongoDBCommandListener(monitoring.CommandListener):
    def started(self, event):
        logging.info("[" + str(self.__module__) + "][" + __name__ + "] Command {0.command_name} with request id "
                                                             "{0.request_id} started on server "
                                                             "{0.connection_id}".format(event))

    def succeeded(self, event):
        logging.info("[" + str(self.__module__) + "][" + __name__ + "] Command {0.command_name} with request id "
                                                             "{0.request_id} on server {0.connection_id} "
                                                             "succeeded in {0.duration_micros} "
                                                             "microseconds".format(event))

    def failed(self, event):
        logging.info("[" + str(self.__module__) + "][" + __name__ + "] Command {0.command_name} with request id "
                                                             "{0.request_id} on server {0.connection_id} "
                                                             "failed in {0.duration_micros} "
                                                             "microseconds".format(event))

class MongoDBServerHeartbeatListener(monitoring.ServerHeartbeatListener):

    def started(self, event):
        logging.info("[" + str(self.__module__) + "][" + __name__ + "] Heartbeat sent to server "
                                                             "{0.connection_id}".format(event))

    def succeeded(self, event):
        # The reply.document attribute was added in PyMongo 3.4.
        logging.info("[" + str(self.__module__) + "][" + __name__ + "] Heartbeat to server {0.connection_id} "
                                                             "succeeded with reply "
                                                             "{0.reply.document}".format(event))

    def failed(self, event):
        logging.info("[" + str(self.__module__) + "][" + __name__ + "] Heartbeat to server {0.connection_id} "
                                                             "failed with error {0.reply}".format(event))


class MongoDataLoader:
    
    class Error:
        AlreadyClosedError = 1
        FindDocumentTimeoutError = 2
        UpdateDocumentTimeoutError = 3
        DeleteTimeoutError = 4
        InsertDocumentTimeoutError = 5
        ServerLaunchError = 6
        ServerShutdownError = 7
        InsertDocumentsTimeoutError = 8
        TestOperationError = 9
        BindIPError = 10

    def __init__(self, configurationFile: str):
        
        self.__mongo_client__ = None
        self.__is_closed__ = False
        self.__mongo_mutex__ = Lock()

        try:
            print("[" + str(self.__module__) + "][" + __name__ + "] get MongoDB configuration")
            self.get_configuration_from_file(configurationFile)    
        except Exception as e:
            print("[" + str(self.__module__) + "][" + __name__ + "] fail to configure MongoDB with Exception: " + str(e))
            raise e
        
        self.__driver__ = pymongo.driver_info.DriverInfo(name=str(self.__appName__), version=self.__appVersion__, platform=sys.platform)
        
        try:
            print("[" + str(self.__module__) + "][" + __name__ + "] register MongoDB event listeners")
            self.register_listener()
        except Exception as e:
            print("[" + str(self.__module__) + "][" + __name__ + "] fail to register MongoDB event listeners with Exception: " + str(e))
            raise e

        try:
            print("[" + str(self.__module__) + "][" + __name__ + "] MongoDB server launch at " + str(self.__bind_ips__) + ":" + str(self.__bind_port__))
            self.start_mongodb_server()
        except Exception as e:
            print("[" + str(self.__module__) + "][" + __name__ + "] fail to launch MongoDB server with Exception: " + str(e))
            raise e
        

        try:
            print("[" + str(self.__module__) + "][" + __name__ + "] MongoDB client connection")
            self.connect()
        except Exception as e:
            print("[" + str(self.__module__) + "][" + __name__ + "] MongoDB client connection fail with Exception: " + str(e))
            raise e
        
            
        try:
            print("[" + str(self.__module__) + "][" + __name__ + "] MongoDB server check connection")
            if not self.is_mongodb_server_connected():
                raise pymongo.errors.PyMongoError(
                    "MongoDB server " + str(self.__bind_ips__[0]) + ":" + str(self.__bind_port__) + " unreachable")
        except Exception as e:
            print("[" + str(self.__module__) + "][" + __name__ + "] MongoDB server check connection fails with Exception: " + str(e))
            raise e


        print("[" + str(self.__module__) + "][" + __name__ + "] MongoDB client/server test operations")
        if self.test_operations():
            print(
                "[" + str(self.__module__) + "][" + __name__ + "] MongoDB client/server operations tested successfully")
        else:
            print("[" + str(self.__module__) + "][" + __name__ + "] MongoDB client/server test operations fails")
            raise MongoDataLoaderTestOperationException("MongoDB client/server test operations fails", MongoDataLoader.Error.TestOperationError)

    
    def get_configuration_from_file(self, configurationFile: str):    
        try:
            with open(configurationFile) as configurationFile:
                configuration = json.load(configurationFile)       
                self.__appName__ = str(configuration["appName"])
                self.__appVersion__ = str(configuration["appVersion"])

                mongodb_configuration = configuration["mongodb"]
                self.__bind_ips__ = mongodb_configuration["bindIPs"]
                self.__bind_port__ = int(mongodb_configuration["bindPort"])
                self.__data_path__ = str(mongodb_configuration["dataPath"])
                self.__log_path__ = str(mongodb_configuration["logPath"])
                self.__database__ = str(mongodb_configuration["databaseName"])
                self.__collection__ = str(mongodb_configuration["collectionName"])
                self.__operationTimeoutSeconds__ = int(mongodb_configuration["operationsTimeoutSeconds"])

                self.__mongodb_connection_configuration__ = mongodb_configuration["connectionConfiguration"]
                self.__mongodb_connection_configuration__["directConnection"] = json.loads(str(self.__mongodb_connection_configuration__["directConnection"]).lower())
                self.__mongodb_connection_configuration__["retryWrites"] = json.loads(str(self.__mongodb_connection_configuration__["retryWrites"]).lower())
                self.__mongodb_connection_configuration__["retryReads"] = json.loads(str(self.__mongodb_connection_configuration__["retryReads"]).lower())

        except Exception as e:
            print("[" + str(self.__module__) + "][" + __name__ + "] unable to read configuration file " + configurationFile + " with Exception: " + str(e))
            raise e
            
    def register_listener(self):
        try:
            monitoring.register(MongoDBCommandListener())
            monitoring.register(MongoDBServerListener())
            monitoring.register(MongoDBServerHeartbeatListener())
        except Exception as e:
            print("[" + str(self.__module__) + "][" + __name__ + "] fail to connect to MongoDB with Exception: " + str(e))
            raise e

    def connect(self):
        try:
            self.__mongo_client__ = MongoClient(connect=True, host=str(self.__bind_ips__[0]), port=self.__bind_port__, **self.__mongodb_connection_configuration__)
            self.__mongo_database__ = self.__mongo_client__.get_database(self.__database__)
            self.__mongo_collection__ = self.__mongo_database__.get_collection(self.__collection__)
        except Exception as e:
            print("[" + str(self.__module__) + "][" + __name__ + "] fail to connect to MongoDB with Exception: " + str(e))
            raise e

    def reconnect(self):
        with self.__mongo_mutex__:
            if not self.__is_closed__:
                try:
                    print("[" + str(self.__module__) + "][" + __name__ + "] reconnect to MongoDB")
                    if not self.is_mongodb_server_connected():
                        self.start_mongodb_server()
                    self.connect()
                except Exception as e:
                    print("[" + str(self.__module__) + "][" + __name__ + "] fail to reconnect to MongoDB with Exception: - " + str(e))
                    raise e
            else:
                raise MongoDataLoaderAlreadyClosedException("Mongo Data Loader already closed", self.Error.AlreadyClosedError)
        
    def close(self):
        with self.__mongo_mutex__:
            if not self.__is_closed__:
                try:
                    self.__is_closed__ = True
                    print("[" + str(self.__module__) + "][" + __name__ + "] close Mongo Data Loader")
                    if self.is_mongodb_server_connected():
                        self.shutdown_mongodb_server()
                    self.__mongo_client__.close()
                    print("[" + str(self.__module__) + "][" + __name__ + "] Mongo Data Loader closed")
                except Exception as e:
                    print("[" + str(self.__module__) + "][" + __name__ + "] fail to close MongoDB connection with Exception: - " + str(e))
                    raise e
            else:
                raise MongoDataLoaderAlreadyClosedException("Mongo Data Loader already closed", self.Error.AlreadyClosedError)
                

    def is_connected(self):
        with self.__mongo_mutex__:
            if not self.__is_closed__:
                try:
                    if self.is_mongodb_server_connected():
                        return True
                    else:
                        return False
                except Exception as e:
                    print("[" + str(
                        self.__module__) + "][" + __name__ + "] fail to verify to MongoDB connection with Exception: - " + str(e))
                    raise e
            else:
                raise MongoDataLoaderAlreadyClosedException("Mongo Data Loader already closed", self.Error.AlreadyClosedError)

    def start_mongodb_server(self):
        try:
            
            
            if len(self.__bind_ips__) == 0:
                raise MongoDataLoaderServerLaunchException("unable to start MongoDB server, specify at least one IP address into bindIPs configuration array", MongoDataLoader.Error.BindIPError)
            
            bindIPsStr = self.__bind_ips__[0]
            for ip in self.__bind_ips__:
                bindIPsStr += ("," + str(ip))

            # Setup MongoDB Server launch command
            mongodb_server_start_cmd = ["mongod",
                                "--dbpath=" + str(self.__data_path__),
                                "--bind_ip=" + bindIPsStr,
                                "--port=" + str(self.__bind_port__),
                                "--logpath=" + str(self.__log_path__) + "/mongod.log",
                                "--logappend"]

            # Start the MongoDB Server process
            mongodb_server_process = subprocess.Popen(mongodb_server_start_cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

            try:
                mongodb_server_process.wait(timeout=3)
            except subprocess.TimeoutExpired:
                if mongodb_server_process.returncode is None:
                    return

            if mongodb_server_process.returncode == 48:
                print("[" + str(self.__module__) + "][" + __name__ + "] MongoDB server already started")
                return
            elif mongodb_server_process.returncode == 100:
                raise MongoDataLoaderServerLaunchException("unable to find directory paths, return code=" + str(mongodb_server_process.returncode), MongoDataLoader.Error.ServerLaunchError)
            else:
                raise MongoDataLoaderServerLaunchException("unable to start MongoDB server, return code=" + str(mongodb_server_process.returncode), MongoDataLoader.Error.ServerLaunchError)
        except Exception as e:
            raise e
    
    def shutdown_mongodb_server(self):
        try:
            mongodb_server_stop_cmd = ["mongod",
                                "--dbpath=" + str(self.__data_path__),
                                "--logpath=" + str(self.__log_path__) + "/mongod.log",
                                "--logappend", "--shutdown"]
            
            mongodb_server_process = subprocess.Popen(mongodb_server_stop_cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            mongodb_server_process.wait()
            if mongodb_server_process.returncode != 0 and mongodb_server_process.returncode != 1:
                raise MongoDataLoaderServerShutdownException("unable to shutdown MongoDB server, return code=" + str(mongodb_server_process.returncode), MongoDataLoader.Error.ServerShutdownError)
        except Exception as e:
            raise e
    
    def is_mongodb_server_connected(self):
        try:
            self.__mongo_client__.admin.command('ping')
            return True
        except pymongo.errors.ConnectionFailure as e:
            return False

    def insert_document(self, document: dict = None, timeout: float = 10):
        try:
            with pymongo.timeout(timeout):
                result = self.__mongo_collection__.insert_one(document)
                if not result or not result.acknowledged:
                    raise pymongo.errors.PyMongoError("Unable to insert document")
                return result
        except pymongo.errors.PyMongoError as e:
            if e.timeout:
                raise MongoDataLoaderOperationTimeoutException("Insert Document timeout expired", MongoDataLoader.Error.InsertDocumentTimeoutError)
            else:
                raise e
        except Exception as e:
            raise e

    def update_document(self, update_document: dict = None, filter: dict = None, timeout: float = 10):
        try:
            with pymongo.timeout(timeout):
                result = self.__mongo_collection__.update_one(filter, update_document)
                if not result or not result.acknowledged:
                    raise pymongo.errors.PyMongoError("Unable to update document")
                return result
        except pymongo.errors.PyMongoError as e:
            if e.timeout:
                raise MongoDataLoaderOperationTimeoutException("Update Document timeout expired", MongoDataLoader.Error.UpdateDcoumentTimeoutError)
            else:
                raise e
        except Exception as e:
            raise e

    def delete_document(self, filter: dict = None, timeout: float = 10):
        try:
            with pymongo.timeout(timeout):
                result = self.__mongo_collection__.delete_one(filter)
                if not result or not result.acknowledged:
                    raise pymongo.errors.PyMongoError("Unable to delete document")
                return result
        except pymongo.errors.PyMongoError as e:
            if e.timeout:
                raise MongoDataLoaderOperationTimeoutException("Delete Document timeout expired", MongoDataLoader.Error.DeleteDocumentTimeoutError)
            else:
                raise e
        except Exception as e:
            raise e
    
    def insert_documents(self, documents: List[dict], timeout: float = 10):
        try:
            with pymongo.timeout(timeout):
                result = self.__mongo_collection__.insert_many(documents)
                if not result or not result.acknowledged:
                    raise pymongo.errors.PyMongoError("Unable to insert documents")
                return result
        except pymongo.errors.PyMongoError as e:
            if e.timeout:
                raise MongoDataLoaderOperationTimeoutException("Insert Documents timeout expired", MongoDataLoader.Error.InsertDocumentsTimeoutError)
            else:
                raise e
        except Exception as e:
            raise e

    def find_document(self, filter_document: dict = None, timeout: float = 10):
        try:
            with pymongo.timeout(timeout):
                return self.__mongo_collection__.find_one(filter_document)
        except pymongo.errors.PyMongoError as e:
            if e.timeout:
                raise MongoDataLoaderOperationTimeoutException("Find Document timeout expired", MongoDataLoader.Error.FindDocumentTimeoutError)
            else:
                raise e
        except Exception as e:
            raise e

    def device_data_exist(self, topicKey:str = None, topicValue: str = None, deviceKey:str = None, deviceValue: str = None, currDateHalfKey:str = None, currDateHalfValue: datetime = None, timeout: float = 10):
        with self.__mongo_mutex__:
            if not self.__is_closed__:
                try:
                    document = self.find_document(filter_document={topicKey: topicValue, deviceKey: deviceValue, currDateHalfKey: currDateHalfValue}, timeout=timeout)
                    if document is None:
                        return False, document
                    else:
                        return True, document
                except Exception as e:
                    raise e
            else:
                raise MongoDataLoaderAlreadyClosedException("Mongo Data Loader already closed", self.Error.AlreadyClosedError)

    def update_device_data(self, newdataValue, dataKey:str = None, filter: dict = None, timeout: float = 10):
        with self.__mongo_mutex__:
            if not self.__is_closed__:
                try:
                    update_document = {"$set": {dataKey: newdataValue}}
                    result = self.update_document(update_document=update_document, filter=filter, timeout=timeout)
                    if result.matched_count == 0:
                        return False
                    else:
                        return True
                except Exception as e:
                    raise e
            else:
                raise MongoDataLoaderAlreadyClosedException("Mongo Data Loader already closed", self.Error.AlreadyClosedError)

    def insert_device_data(self, document: dict = None, timeout: int = 10):
        with self.__mongo_mutex__:
            if not self.__is_closed__:
                try:
                    document = self.insert_document(document=document, timeout=timeout)
                    if document is None:
                        return False, document
                    else:
                        return True, document
                except Exception as e:
                    raise e
            else:
                raise MongoDataLoaderAlreadyClosedException("Mongo Data Loader already closed", self.Error.AlreadyClosedError)

    def test_operations(self, timeout: float = 10):
        document = {}

        # Test insert and delete document
        try:
            insertion_result = self.insert_document(document, timeout=timeout)
            if not insertion_result.acknowledged or insertion_result.inserted_id is None or not insertion_result:
                return False
        except Exception as e:
            return False

        try:
            delete_result = self.delete_document({'_id': ObjectId(insertion_result.inserted_id)})
            if not delete_result.acknowledged or delete_result.deleted_count == 0 or not delete_result:
                return False
        except Exception as e:
            return False

        return True



















