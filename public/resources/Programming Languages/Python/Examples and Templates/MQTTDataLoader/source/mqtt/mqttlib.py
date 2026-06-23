import sys
from datetime import datetime, timezone
import json
from typing import List
import multiprocessing
import time

import bson
import pytz
from pymongo.errors import ConnectionFailure
import paho.mqtt.client as MqttClient

from mongo.mongolib import MongoDataLoaderAlreadyClosedException
from mongo.mongolib import MongoDataLoaderOperationTimeoutException

documentId = 0

class MQTTManager:

    def __init__(self, mongo_data_loader, configurationFile: str):
        
        self.__connected__ = False
        self.__mongo_data_loader__ = mongo_data_loader
        self.__connected__ = False

        try:
            print("[" + str(self.__module__) + "][" + __name__ + "] get MQTT Manager configuration")
            self.get_configuration_from_file(configurationFile)    
        except Exception as e:
            print("[" + str(self.__module__) + "][" + __name__ + "] fail to configure MQTT Manager with Exception: " + str(e))
            raise e


        self.__mqtt_client__ = MqttClient.Client()

        try:
            print("[" + str(self.__module__) + "][" + __name__ + "] set username and password")
            self.username_pw_set()
        except Exception as e:
            print("[" + str(self.__module__) + "][" + __name__ + "] fail to set username and password with Exception: " + str(e))
            raise e

        try:
            print("[" + str(self.__module__) + "][" + __name__ + "] set MQTT callbacks")
            self.set_callbacks()
        except Exception as e:
            print("[" + str(self.__module__) + "][" + __name__ + "] fail to set MQTT callbacks with Exception: " + str(e))
            raise e

        try:
            print("[" + str(self.__module__) + "][" + __name__ + "] try to require connection to MQTT Broker " + self.__broker_address__ + ":" + str(self.__broker_port__))
            self.connect()
        except Exception as e:
            print("[" + str(self.__module__) + "][" + __name__ + "] fail to require connection to MQTT Broker with Exception: " + str(e))
            raise e

        try:
            print("[" + str(self.__module__) + "][" + __name__ + "] wait for connection")
            self.wait_for_connection()
        except Exception as e:
            print("[" + str(self.__module__) + "][" + __name__ + "] fail to wait connection from MQTT Broker " + self.__broker_address__ + ":" + str(self.__broker_port__) + " with Exception: " + str(e))
            raise e


    def get_configuration_from_file(self, configurationFile: str):    
        try:
            with open(configurationFile) as conf:
                configuration = json.load(conf)
                mqtt_configuration = configuration["mqtt"]
                self.__broker_address__ = str(mqtt_configuration["brokerIp"])
                self.__broker_port__ = int(mqtt_configuration["brokerPort"])
                self.__topics__ = mqtt_configuration["topics"]
                self.__username__ = str(mqtt_configuration["username"])
                self.__password__ = str(mqtt_configuration["password"])
                self.__keep_alive__ = int(mqtt_configuration["keepAliveSec"])        
        except Exception as e:
            print("[" + str(self.__module__) + "][" + __name__ + "] unable to read configuration file " + configurationFile + " with Exception: " + str(e))
            raise e
        
    def is_connected(self):
        return self.__connected__

    def set_callbacks(self):
        try:
            print("[" + str(self.__module__) + "][" + __name__ + "] set callbacks")
            self.__mqtt_client__.on_connect = self.on_connect
            self.__mqtt_client__.on_message = self.on_message
            self.__mqtt_client__.on_disconnect = self.on_disconnect
            self.__mqtt_client__.on_subscribe = self.on_subscribe
            self.__mqtt_client__.on_connect_fail = self.on_connect_fail
            self.__mqtt_client__.on_unsubscribe = self.on_unsubscribe
        except Exception as e:
            print("[" + str(self.__module__) + "][" + __name__ + "] unable to set callbacks")
            raise e
    
    def unset_callbacks(self):
        try:
            print("[" + str(self.__module__) + "][" + __name__ + "] unset callbacks")
            self.__mqtt_client__.on_connect = None
            self.__mqtt_client__.on_message = None
            self.__mqtt_client__.on_disconnect = None
            self.__mqtt_client__.on_subscribe = None
            self.__mqtt_client__.on_connect_fail = None
            self.__mqtt_client__.on_unsubscribe = None
        except Exception as e:
            print("[" + str(self.__module__) + "][" + __name__ + "] unable to unset callbacks")
            raise e
    
    def wait_for_connection(self, timeout: int = 0):
        if timeout < 0:
            raise Exception("Invalid timeout setting")
        elif timeout == 0:
            try:
                while not self.is_connected():
                    time.sleep(0.001)
            except Exception as e:
                print("[" + str(self.__module__) + "][" + __name__ + "] fail to wait connection from MQTT Broker " + self.__broker_address__ + ":" + str(self.__broker_port__) + " with Exception: " + str(e))
                raise e
        else:
            try:
                while not self.is_connected() and timeout > 0:
                    time.sleep(0.001)
                    timeout -=1
            except Exception as e:
                print("[" + str(self.__module__) + "][" + __name__ + "] fail to wait connection from MQTT Broker " + self.__broker_address__ + ":" + str(self.__broker_port__) + " with Exception: " + str(e))
                raise e
    
    def wait_for_disconnection(self, timeout: int = 0):
        if timeout < 0:
            raise Exception("Invalid timeout setting")
        elif timeout == 0:
            try:
                while self.is_connected():
                    time.sleep(0.001)
            except Exception as e:
                print("[" + str(self.__module__) + "][" + __name__ + "] fail to wait connection from MQTT Broker " + self.__broker_address__ + ":" + str(self.__broker_port__) + " with Exception: " + str(e))
                raise e
        else:
            try:
                while self.is_connected() and timeout > 0:
                    time.sleep(0.001)
                    timeout -=1
            except Exception as e:
                print("[" + str(self.__module__) + "][" + __name__ + "] fail to wait connection from MQTT Broker " + self.__broker_address__ + ":" + str(self.__broker_port__) + " with Exception: " + str(e))
                raise e


    # Paho-MQTT Network function wrappers

    def connect(self):
        try:
            print("[" + str(self.__module__) + "][" + __name__ + "] connect to " + self.__broker_address__ + ":" + str(self.__broker_port__))
            self.__mqtt_client__.connect(self.__broker_address__, self.__broker_port__, self.__keep_alive__)
            self.__mqtt_client__.loop_start()
        except Exception as e:
            print("[" + str(self.__module__) + "][" + __name__ + "] unable to connect to " + self.__broker_address__ + ":" + str(self.__broker_port__))
            raise e

    def disconnect(self):
        try:
            print("[" + str(self.__module__) + "][" + __name__ + "] disconnect from " + self.__broker_address__ + ":" + str(self.__broker_port__))
            self.__mqtt_client__.disconnect()
        except Exception as e:
            print("[" + str(self.__module__) + "][" + __name__ + "] unable to disconnect from " + self.__broker_address__ + ":" + str(self.__broker_port__))
            raise e
        
    def reconnect(self):
        try:
            print("[" + str(self.__module__) + "][" + __name__ + "] try to reconnect to " + self.__broker_address__ + ":" + str(self.__broker_port__))
            self.__mqtt_client__.reconnect()
        except Exception as e:
            print("[" + str(self.__module__) + "][" + __name__ + "] unable to reconnect from " + self.__broker_address__ + ":" + str(self.__broker_port__))
            raise e

    def username_pw_set(self):
        try:
            print("[" + str(self.__module__) + "][" + __name__ + "] connect to " + self.__broker_address__ + ":" + str(self.__broker_port__))
            self.__mqtt_client__.username_pw_set(username=self.__username__, password=self.__password__)
        except Exception as e:
            print("[" + str(self.__module__) + "][" + __name__ + "] unable to set to " + self.__broker_address__ + ":" + str(self.__broker_port__))
            raise e
        

    # MQTT Network Callbacks

    def on_connect(self, mqttclient, userdata, flags, rc):
        if rc != 0:
            print("[" + str(self.__module__) + "][" + __name__ + "] connection to " + self.__broker_address__ + ":" + str(
                self.__broker_port__) + " fails")
            self.__connected__ = False
        else:
            print("[" + str(self.__module__) + "][" + __name__ + "] connected to " + self.__broker_address__ + ":" + str(
                self.__broker_port__))
            self.__connected__ = True

        
        try:
            for topic in self.__topics__:
                try:
                    self.__mqtt_client__.subscribe(str(topic) + "/#")
                    print("[" + str(self.__module__) + "][" + __name__ + "] Subscribe to mqtt topic " + str(topic))
                except ValueError as e:
                    print("[" + str(self.__module__) + "][" + __name__ + "] Subscription to mqtt topic " + str(
                        topic) + " fails")
                    raise e
        except Exception as e:
            raise e

    def on_connect_fail(self, mqttclient, userdata, flags, rc):
        if rc != 0:
            print("[" + str(self.__module__) + "][" + __name__ + "] connection to " + self.__broker_address__ + ":" + str(
                self.__broker_port__) + " fails")
            self.__connected__ = False

    def on_disconnect(self, mqttclient, userdata, rc):
        print("[" + str(self.__module__) + "][" + __name__ + "] disconnected from " + self.__broker_address__ + ":" + str(
            self.__broker_port__))
        self.__connected__ = False
        
        # Try to reconnect until connection request does not fail
        while True:
            try:
                print("[" + str(self.__module__) + "][" + __name__ + "] reconnect to MQTT Broker " + self.__broker_address__ + ":" + str(self.__broker_port__))              
                self.reconnect()              
                break
            except Exception as e:
                print("[" + str(self.__module__) + "][" + __name__ + "] fail to reconnect to MQTT Broker " + self.__broker_address__ + ":" + str(self.__broker_port__) + " with Exception: " + str(e))

    def on_disconnect_finally(self, mqttclient, userdata, rc):
        print("[" + str(self.__module__) + "][" + __name__ + "] disconnected from " + self.__broker_address__ + ":" + str(
            self.__broker_port__))
        self.__mqtt_client__.loop_stop()
        self.__connected__ = False
    
    def on_subscribe(self, mqttclient, userdata, flags, rc):
        if rc[0] != 0:
            print("[" + str(self.__module__) + "][" + __name__ + "] subscription to " + self.__broker_address__ + ":" + str(
                self.__broker_port__) + " fails")
        else:
            print("[" + str(self.__module__) + "][" + __name__ + "] subscribed to " + self.__broker_address__ + ":" + str(
                self.__broker_port__))

    def on_unsubscribe(self, mqttclient, userdata, flags, rc):
        if rc != 0:
            print("[" + str(self.__module__) + "][" + __name__ + "] unsubscription to " + self.__broker_address__ + ":" + str(
                self.__broker_port__) + " fails")
        else:
            print("[" + str(self.__module__) + "][" + __name__ + "] unsubscribed to " + self.__broker_address__ + ":" + str(
                self.__broker_port__))

    def on_message(self, mqttclient, userdata, msg):
        try:
            # Parse mqtt message
            mqttheader = msg.topic.split('/')
            sourceApp = str(mqttheader[0])
            deviceAddr = str(mqttheader[1])
            addictedData = dict(json.loads(str(msg.payload.decode("utf-8"))))

            try:
                timeArray = str(addictedData["Time"]).split(" ")
                currentHour = int(timeArray[3].split(":")[0])
                currentMonthString = str(timeArray[1])
                currentDay = str(timeArray[2])
                currentYear = str(timeArray[5])
                currentMonth = ""
                if currentMonthString == "gen" or currentMonthString == "Jan" or currentMonthString == "Jan":
                    currentMonth = "01"
                elif currentMonthString == "feb" or currentMonthString == "Feb" or currentMonthString == "Feb":
                    currentMonth = "02"
                elif currentMonthString == "mar" or currentMonthString == "Mar" or currentMonthString == "Mar":
                    currentMonth = "03"
                elif currentMonthString == "apr" or currentMonthString == "Apr" or currentMonthString == "Apr":
                    currentMonth = "04"
                elif currentMonthString == "mag" or currentMonthString == "May" or currentMonthString == "Mai":
                    currentMonth = "05"
                elif currentMonthString == "giu" or currentMonthString == "Jun" or currentMonthString == "Jun":
                    currentMonth = "06"
                elif currentMonthString == "lug" or currentMonthString == "Jul" or currentMonthString == "Jul":
                    currentMonth = "07"
                elif currentMonthString == "ago" or currentMonthString == "Aug" or currentMonthString == "Aug":
                    currentMonth = "08"
                elif currentMonthString == "set" or currentMonthString == "Sep" or currentMonthString == "Sep":
                    currentMonth = "09"
                elif currentMonthString == "ott" or currentMonthString == "Oct" or currentMonthString == "Okt":
                    currentMonth = "10"
                elif currentMonthString == "nov" or currentMonthString == "Nov" or currentMonthString == "Nov":
                    currentMonth = "11"
                elif currentMonthString == "dic" or currentMonthString == "Dec" or currentMonthString == "Dez":
                    currentMonth = "12"

                if currentHour >= 0 and currentHour < 12:
                    currentHour = 0
                else:
                    currentHour = 12

                currentDate = currentYear + "-" + currentMonth + "-" + currentDay + "-" + str(currentHour)
                currentDateHalf = datetime.strptime(currentDate, "%Y-%m-%d-%H")
            except Exception as e:
                print(str(e))

            try:
                dateTime = datetime.strptime(addictedData["TIME"], "%Y-%m-%d %H:%M:%S")
                currentHour = dateTime.hour
                if currentHour >= 0 and currentHour < 12:
                    currentHour = 0
                else:
                    currentHour = 12

                currentDate = str(dateTime.year) + "-" + str(dateTime.month) + "-" + str(dateTime.day) + "-" + str(currentHour)
                currentDateHalf = datetime.strptime(currentDate, "%Y-%m-%d-%H")

            except Exception as e:
                print(str(e))


            # Create timestamp to attach to mqtt arrived message
            timestamp = timestamp = datetime.now()

            print("[" + str(self.__module__) + "][" + __name__ + "] New MQTT message from device " + deviceAddr)
            print("[" + str(self.__module__) + "][" + __name__ + "] MQTT Header=" + msg.topic + ", MQTT Payload=" + str(msg.payload))
            print("[" + str(self.__module__) + "][" + __name__ + "] MQTT Header data size=" + str(len(msg.topic)) + "byte, MQTT Payload size=" + str(len(msg.payload.decode("utf-8"))) + "byte")
            print("[" + str(self.__module__) + "][" + __name__ + "] Usefull Header data size=" + str(len(sourceApp+deviceAddr)) + "byte, Usefull Payload data size=" + str(len(addictedData) + len(str(timestamp))) + "byte")


            try:
                # Verify device presence on database
                result, document = self.__mongo_data_loader__.device_data_exist(topicKey='sourceApp',
                                                                                topicValue=sourceApp,
                                                                                deviceKey='deviceAddr',
                                                                                deviceValue=deviceAddr,
                                                                                currDateHalfKey="currentDateHalf",
                                                                                currDateHalfValue=currentDateHalf,
                                                                                timeout=1)
            except MongoDataLoaderAlreadyClosedException:
                    return
            except MongoDataLoaderOperationTimeoutException as e:
                print("[" + str(self.__module__) + "][" + __name__ + "] Exception: " + str(e))
                if not self.__mongo_data_loader__.is_connected():
                    try:
                        # Reconnect Mongo Data Loader if it is not connected
                        print("[" + str(self.__module__) + "][" + __name__ + "] MongoDB client disconnected")
                        self.__mongo_data_loader__.reconnect()
                        # Verify device presence on database
                        result, document = self.__mongo_data_loader__.device_data_exist(topicKey='sourceApp',
                                                                                topicValue=sourceApp,
                                                                                deviceKey='deviceAddr',
                                                                                deviceValue=deviceAddr,
                                                                                currDateHalfKey="currentDateHalf",
                                                                                currDateHalfValue=currentDateHalf,
                                                                                timeout=1)
                    except Exception as e:
                        print("[" + str(self.__module__) + "][" + __name__ + "] Exception: " + str(e))
                        return
            except Exception as e:
                        print("[" + str(self.__module__) + "][" + __name__ + "] Exception: " + str(e))
                        return


            if not result:
                # Create first device document
                document = {}
                document['sourceApp'] = sourceApp
                document['deviceAddr'] = deviceAddr
                document['currentDateHalf'] = currentDateHalf

                header_document_size = len(bson.BSON.encode(document))
                print("[" + str(self.__module__) + "][" + __name__ + "] BSON Document header size=" + str(header_document_size) + "byte")

                data_document = {}
                data_document['addictedData'] = addictedData
                data_document['timestamp'] = timestamp

                data_array = [data_document]
                document['data'] = data_array

                payload_document_size = len(bson.BSON.encode(document))-header_document_size
                print("[" + str(self.__module__) + "][" + __name__ + "] BSON Document payload size=" + str(payload_document_size) + "byte")

                try:
                    # Insert new device document for the given topic
                    self.__mongo_data_loader__.insert_device_data(document=document, timeout=1)
                    print("[" + str(self.__module__) + "][" + __name__ + "] Device document inserted")
                except MongoDataLoaderAlreadyClosedException:
                    return
                except MongoDataLoaderOperationTimeoutException as e:
                    print("[" + str(self.__module__) + "][" + __name__ + "] Exception " + str(e))
                    if not self.__mongo_data_loader__.is_connected():
                        try:
                            # Reconnect Mongo Data Loader if it is not connected
                            print("[" + str(self.__module__) + "][" + __name__ + "] MongoDB client disconnected")
                            self.__mongo_data_loader__.reconnect()
                            # Verify device presence on database
                            result, document = self.__mongo_data_loader__.insert_device_data(document=document, timeout=1)
                        except Exception as e:
                            print("[" + str(self.__module__) + "][" + __name__ + "] Exception " + str(e))
                            return
                except Exception as e:
                        print("[" + str(self.__module__) + "][" + __name__ + "] Exception: " + str(e))
                        return

            else:

                # Calculate BSON document size before insertion of new addicted data
                document_size = len(bson.BSON.encode(document))

                # Attach new data to existing device document
                data_document = {}
                data_document['addictedData'] = addictedData
                data_document['timestamp'] = timestamp
                document['data'].append(data_document)

                # Calculate BSON document size after insertion of new addicted data
                updated_document_size = len(bson.BSON.encode(document))
                print("[" + str(self.__module__) + "][" + __name__ + "] BSON Document grow by size=" + str(updated_document_size - document_size) + "byte")


                try:
                    # Update device document for the given topic
                    update_filter = {'sourceApp': sourceApp, 'deviceAddr': deviceAddr, 'currentDateHalf': currentDateHalf}
                    self.__mongo_data_loader__.update_device_data(newdataValue=document['data'], 
                                                                  dataKey='data', 
                                                                  filter=update_filter, 
                                                                  timeout=1)
                    print("[" + str(self.__module__) + "][" + __name__ + "] Device document updated")
                except MongoDataLoaderAlreadyClosedException:
                    return
                except MongoDataLoaderOperationTimeoutException as e:
                    print("[" + str(self.__module__) + "][" + __name__ + "] Exception " + str(e))
                    if not self.__mongo_data_loader__.is_connected():
                        try:
                            # Reconnect Mongo Data Loader if it is not connected
                            print("[" + str(self.__module__) + "][" + __name__ + "] MongoDB client disconnected")
                            self.__mongo_data_loader__.reconnect()
                            # Update device document for the given topic
                            result, document = self.__mongo_data_loader__.update_device_data(newdataValue=document['data'], 
                                                                                             dataKey='data', 
                                                                                             filter=update_filter, 
                                                                                             timeout=1)
                        except Exception as e:
                            print("[" + str(self.__module__) + "][" + __name__ + "] Exception: " + str(e))
                            return
                except Exception as e:
                        print("[" + str(self.__module__) + "][" + __name__ + "] Exception: " + str(e))
                        return

        except Exception as e:
            print("[" + str(self.__module__) + "][" + __name__ + "] Exception " + str(e))
            return


    
    def close(self):
        print("[" + str(self.__module__) + "][" + __name__ + "] close MQTT Manager")
        try:
            self.unset_callbacks()
            self.__mqtt_client__.on_disconnect = self.on_disconnect_finally
            self.disconnect()
            self.wait_for_disconnection()
            print("[" + str(self.__module__) + "][" + __name__ + "] MQTT Manager closed")
        except Exception as e:
            print("[" + str(self.__module__) + "][" + __name__ + "] fail to close MQTT Manager with Exception: " + str(e))
            return
        
    