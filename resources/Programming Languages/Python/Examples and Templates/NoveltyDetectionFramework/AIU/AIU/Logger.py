import pymongo
from typing import Dict

class Logger:
    datalog = False

    @classmethod
    def Enable(cls):
        cls.datalog = True

    @classmethod
    def Disable(cls):
        cls.datalog = False

    @classmethod
    def MongoLogger(cls, log_collection: pymongo.collection, log: Dict):
        if cls.datalog:
            try:
                log_collection.insert_one(log)
            except Exception as e:
                print(e)
        return

    @classmethod
    def CmdLogger(cls, log: str):
        if cls.datalog:
            try:
                print(log)
            except Exception as e:
                print(e)