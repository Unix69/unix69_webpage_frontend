import json
import sys
import time
import signal
from typing import List
from mongo.mongolib import MongoDataLoader as mdl
from mqtt.mqttlib import MQTTManager as mqttm


def signal_handler(sig, frame):
    global mongo_data_loader
    global mqtt_manager
    if signal.SIGQUIT or sig == signal.SIGINT or sig == signal.SIGABRT:
        print("[" + __name__ + "] Close MQTT Manager and Mongo Data Loader")
        mongo_data_loader.close()
        mqtt_manager.close()
        print("[" + __name__ + "] Exit successfully")
        sys.exit(0)

signal.signal(signal.SIGINT, signal_handler)
signal.signal(signal.SIGABRT, signal_handler)
signal.signal(signal.SIGQUIT, signal_handler)


appName = "MQTTDataLoader"
appVersion = "0"
mongo_data_loader = None
mqtt_manager = None
mongodbMaxRetryConnectionAtStartup = None
mqttMaxRetryConnectionAtStartup = None

def get_configuration_from_file():
    global appConfigurationFile
    global appName  
    global appVersion
    global mongodbMaxRetryConnectionAtStartup
    global mqttMaxRetryConnectionAtStartup    
    
    try:
        with open(appConfigurationFile) as configurationFile:
            configuration = json.load(configurationFile)
            appName = str(configuration["appName"])
            appVersion = str(configuration["appVersion"])
            mongodbMaxRetryConnectionAtStartup = int(configuration["mongodb"]["maxRetryConnectionAtStartup"])
            mqttMaxRetryConnectionAtStartup = int(configuration["mqtt"]["maxRetryConnectionAtStartup"])
            return
    except Exception as e:
        print("[" + __name__ + "] unable to read configuration file " + appConfigurationFile + " with Exception: " + str(e))
        raise e

def connect_mongodb_client():
    global appConfigurationFile
    try:
        mongo_data_loader = mdl(configurationFile=appConfigurationFile)
        return mongo_data_loader
    except Exception as e:
        print("[" + __name__ + "] unable to connect Mongo Data Loader with Exception: " + str(e))
        raise e

def connect_mqtt_manager(mongo_data_loader, topics: List[str] = None, host: str = "sat01.satechnologies.eu", port: int = 1883, username: str = "rw", password: str = "readwrite", keep_alive: int = 60):
    global appConfigurationFile
    try:
        mqtt_manager = mqttm(mongo_data_loader=mongo_data_loader, configurationFile=appConfigurationFile)
        return mqtt_manager
    except Exception as e:
        print("[" + __name__ + "] unable to connect MQTT Manager with Exception: " + str(e))
        raise e


def init_mongo_data_loader():
    global mongo_data_loader
    global mongodbMaxRetryConnectionAtStartup
    
    # Connect to MongoDB Server
    retry_mongodb_connection = 0

    while retry_mongodb_connection <= mongodbMaxRetryConnectionAtStartup:
        retry_mongodb_connection = retry_mongodb_connection + 1
        try:
            print("[" + __name__ + "] try to connect MongoDB")
            mongo_data_loader = connect_mongodb_client()
            break
        except Exception as e:
            print("[" + __name__ + "] unable to connect MongoDB with Exception: " + str(e))

    if retry_mongodb_connection > mongodbMaxRetryConnectionAtStartup:
        print("[" + __name__ + "] max retry connection reached, exit...")
        raise Exception("Max retry connection reached")
    else:
        print("[" + __name__ + "] MongoDB connected successfully")

def init_mqtt_manager():
    global mongo_data_loader
    global mqtt_manager
    global mqttMaxRetryConnectionAtStartup
    
    retry_mqtt_connection = 0
    while retry_mqtt_connection <= mqttMaxRetryConnectionAtStartup:
        retry_mqtt_connection = retry_mqtt_connection + 1
        try:
            print("[" + __name__ + "] connect to MQTT Broker")
            mqtt_manager = connect_mqtt_manager(mongo_data_loader=mongo_data_loader)
            break
        except Exception as e:
            print("[" + __name__ + "] unable to connect to MQTT Broker with Exception: " + str(e))

    if retry_mqtt_connection > mqttMaxRetryConnectionAtStartup:
        print("[" + __name__ + "] max retry connection reached, exit...")
        raise Exception("Max retry connection reached")
    else:
        print("[" + __name__ + "] MQTT Broker connected successfully")


# Argument management
try:
    if len(sys.argv) == 2:
        appConfigurationFile = sys.argv[1]
    elif len(sys.argv) == 1:
        appConfigurationFile = "./MQTTDataLoader.conf"
    else:
        raise Exception("Invalid arguments")
except Exception as e:
    print("[" + __name__ + "] Arguments reception fail with Exception " + str(e))
    sys.exit(-1)


try:
    print("[" + __name__ + "] configure " + appName + " from " + appConfigurationFile)
    get_configuration_from_file()
except Exception as e:
    print("[" + __name__ + "] unable to configure " + appName + " from " + appConfigurationFile + " with Exception: " + str(e))
    sys.exit(-2)

try:
    print("[" + __name__ + "] initialize MongoDB")
    init_mongo_data_loader()
except Exception as e:
    print("[" + __name__ + "] unable to initialize MongoDB with Exception: " + str(e))
    sys.exit(-3)

try:
    print("[" + __name__ + "] initialize MQTT")
    init_mqtt_manager()
except Exception as e:
    print("[" + __name__ + "] unable to initialize MQTT with Exception: " + str(e))
    sys.exit(-4)

# Maintain process in idle
while True:
    time.sleep(10)

