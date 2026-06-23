
import json
import logging
import threading
from datetime import datetime
import pymongo
from pandas import ExcelWriter
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
import pandas as pd
import os


# Mongo Data Loader Exceptions
class MongoReporterException(Exception):
    def __init__(self, message, errorcode):
        super().__init__(message)
        self.__errorcode__ = errorcode

    def getErrorCode(self):
        return self.__errorcode__


class ProducedEmptyReportException(MongoReporterException):
    def __init__(self, message, errorcode):
        super().__init__(message=message, errorcode=errorcode)


class MongoReporter:

    def __init__(self, mongo_server_ip: str, mongo_server_port: int, mongo_database_name: str, mongo_collection_name: str,
                 mongo_server_selection_timeout_ms: int, logger: logging.Logger):

        self.__logger__ = logger
        self.__logger__.info("Init Mongo Reporter")
        self.__logger__.info("MongoDB Server " + mongo_server_ip + ":" + str(mongo_server_port))
        self.__logger__.info("MongoDB Database " + mongo_database_name + " Collection " + mongo_collection_name)
        self.__logger__.info("MongoDB Server Selection Timeout " + str(mongo_server_selection_timeout_ms) + "ms")
        self.__mongo_server_ip__ = mongo_server_ip
        self.__mongo_server_port__ = mongo_server_port
        self.__mongo_database__ = mongo_database_name
        self.__mongo_collection__ = mongo_collection_name
        self.__mongo_server_selection_timeout_ms__ = mongo_server_selection_timeout_ms
        self.__mongo_client__ = None

    def _connect(self):
        try:
            self.__logger__.info("Connect to MongoDB Server " + self.__mongo_server_ip__ + ":" + str(self.__mongo_server_port__))
            self.__mongo_client__ = MongoClient(host=str(self.__mongo_server_ip__),
                                                port=self.__mongo_server_port__,
                                                serverSelectionTimeoutMS=self.__mongo_server_selection_timeout_ms__)
            self.__mongo_database__ = self.__mongo_client__.get_database(self.__mongo_database__)
            self.__mongo_collection__ = self.__mongo_database__.get_collection(self.__mongo_collection__)
        except Exception as e:
            self.__logger__.error("Fail to connect to MongoDB Server " + self.__mongo_server_ip__ + ":" + str(self.__mongo_server_port__) + " with Exception: " + str(e))
            raise e

    def close(self):
        try:
            self.__logger__.info("Close connection to MongoDB Server " + self.__mongo_server_ip__ + ":" + str(self.__mongo_server_port__))
            self.__mongo_client__.close()
        except Exception as e:
            self.__logger__.error("Fail to close connection to MongoDB Server " + self.__mongo_server_ip__ + ":" + str(self.__mongo_server_port__) + " with Exception: " + str(e))
            raise e

    def _is_connected(self):
        try:
            self.__logger__.info(
                "Verify connection to MongoDB Server " + self.__mongo_server_ip__ + ":" + str(
                    self.__mongo_server_port__))
            self.__mongo_client__.admin.command("ping")
            return True
        except pymongo.errors.ConnectionFailure as e:
            self.__logger__.error(
                "Connection to MongoDB Server " + self.__mongo_server_ip__ + ":" + str(
                    self.__mongo_server_port__) + " not enstablished")
            return False
        except Exception as e:
            self.__logger__.error(
                "Fail to verify connection to MongoDB Server " + self.__mongo_server_ip__ + ":" + str(
                    self.__mongo_server_port__) + " with Exception: " + str(e))
            raise e


    def _get_report_total_data_predicts(self, fromReportDate: datetime, toReportDate: datetime):
        try:
            self.__logger__.info("Get total report data from date " + str(fromReportDate) + " to date " + str(toReportDate))
            pipelineRetrieveTotalReport = [
                                            {
                                                '$match': {
                                                    'sourceApp': 'PREDICTS',
                                                    '$expr': {
                                                        '$and': [
                                                            {
                                                                '$gte': [
                                                                    {
                                                                        '$toDate': '$currentDateHalf'
                                                                    }, {
                                                                        '$toDate': fromReportDate
                                                                    }
                                                                ]
                                                            }, {
                                                                '$lt': [
                                                                    {
                                                                        '$toDate': '$currentDateHalf'
                                                                    }, {
                                                                        '$toDate': toReportDate
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                }
                                            }, {
                                                '$unwind': '$data'
                                            }, {
                                                '$match': {
                                                    'data.addictedData.TYPE': {
                                                        '$bitsAllSet': 2147483649
                                                    }
                                                }
                                            }, {
                                                '$group': {
                                                    '_id': {
                                                        'deviceAddr': '$deviceAddr',
                                                        'Time': '$data.addictedData.TIME',
                                                        'Type': '$data.addictedData.TYPE',
                                                        'DS': '$data.addictedData.DS'
                                                    }
                                                }
                                            }, {
                                                '$sort': {
                                                    '_id.deviceAddr': 1,
                                                    '_id.Time': 1
                                                }
                                            }, {
                                                '$project': {
                                                    '_id': None,
                                                    'deviceAddr': '$_id.deviceAddr',
                                                    'Time': {
                                                        '$dateFromString': {
                                                            'dateString': '$_id.Time',
                                                            'format': '%Y-%m-%d %H:%M:%S'
                                                        }
                                                    },
                                                    'DS': '$_id.DS'
                                                }
                                            }, {
                                                '$group': {
                                                    '_id': {
                                                        'deviceAddr': '$deviceAddr',
                                                        'year': {
                                                            '$year': '$Time'
                                                        },
                                                        'month': {
                                                            '$month': '$Time'
                                                        },
                                                        'day': {
                                                            '$dayOfMonth': '$Time'
                                                        },
                                                        'hour': {
                                                            '$hour': '$Time'
                                                        }
                                                    },
                                                    'alarms': {
                                                        '$push': '$DS'
                                                    },
                                                    'timestamps': {
                                                        '$push': '$Time'
                                                    }
                                                }
                                            }, {
                                                '$project': {
                                                    '_id': None,
                                                    'deviceAddr': '$_id.deviceAddr',
                                                    'year': '$_id.year',
                                                    'month': '$_id.month',
                                                    'day': '$_id.day',
                                                    'hour': '$_id.hour',
                                                    'alarms': '$alarms',
                                                    'logintervals': {
                                                        '$reduce': {
                                                            'input': {
                                                                '$range': [
                                                                    1, {
                                                                        '$size': '$timestamps'
                                                                    }
                                                                ]
                                                            },
                                                            'initialValue': [],
                                                            'in': {
                                                                '$concatArrays': [
                                                                    '$$value', [
                                                                        {
                                                                            '$divide': [
                                                                                {
                                                                                    '$subtract': [
                                                                                        {
                                                                                            '$arrayElemAt': [
                                                                                                '$timestamps', '$$this'
                                                                                            ]
                                                                                        }, {
                                                                                            '$arrayElemAt': [
                                                                                                '$timestamps', {
                                                                                                    '$subtract': [
                                                                                                        '$$this', 1
                                                                                                    ]
                                                                                                }
                                                                                            ]
                                                                                        }
                                                                                    ]
                                                                                }, 1000
                                                                            ]
                                                                        }
                                                                    ]
                                                                ]
                                                            }
                                                        }
                                                    },
                                                    'numOfAlarms': {
                                                        '$size': {
                                                            '$filter': {
                                                                'input': {
                                                                    '$reduce': {
                                                                        'input': '$alarms',
                                                                        'initialValue': [],
                                                                        'in': {
                                                                            '$cond': {
                                                                                'if': {
                                                                                    '$eq': [
                                                                                        {
                                                                                            '$arrayElemAt': [
                                                                                                '$$value', -1
                                                                                            ]
                                                                                        }, '$$this'
                                                                                    ]
                                                                                },
                                                                                'then': '$$value',
                                                                                'else': {
                                                                                    '$concatArrays': [
                                                                                        '$$value', [
                                                                                            '$$this'
                                                                                        ]
                                                                                    ]
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                },
                                                                'as': 'element',
                                                                'cond': {
                                                                    '$eq': [
                                                                        {
                                                                            '$mod': [
                                                                                {
                                                                                    '$floor': {
                                                                                        '$divide': [
                                                                                            '$$element', 16
                                                                                        ]
                                                                                    }
                                                                                }, 2
                                                                            ]
                                                                        }, 1
                                                                    ]
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }, {
                                                '$project': {
                                                    'deviceAddr': 1,
                                                    'hour': 1,
                                                    'numOfAlarms': 1,
                                                    'secOffWrist': { '$toInt': {
                                                        '$reduce': {
                                                            'input': {
                                                                '$map': {
                                                                    'input': {
                                                                        '$range': [
                                                                            0, {
                                                                                '$size': '$logintervals'
                                                                            }
                                                                        ]
                                                                    },
                                                                    'as': 'index',
                                                                    'in': {
                                                                        '$cond': {
                                                                            'if': {
                                                                                '$eq': [
                                                                                    {
                                                                                        '$mod': [
                                                                                            {
                                                                                                '$floor': {
                                                                                                    '$divide': [
                                                                                                        {
                                                                                                            '$arrayElemAt': [
                                                                                                                '$alarms', '$$index'
                                                                                                            ]
                                                                                                        }, 32
                                                                                                    ]
                                                                                                }
                                                                                            }, 2
                                                                                        ]
                                                                                    }, 1
                                                                                ]
                                                                            },
                                                                            'then': {
                                                                                '$arrayElemAt': [
                                                                                    '$logintervals', '$$index'
                                                                                ]
                                                                            },
                                                                            'else': 0
                                                                        }
                                                                    }
                                                                }
                                                            },
                                                            'initialValue': {
                                                                '$cond': {
                                                                    'if': {
                                                                        '$eq': [
                                                                            {
                                                                                '$mod': [
                                                                                    {
                                                                                        '$floor': {
                                                                                            '$divide': [
                                                                                                {
                                                                                                    '$last': '$alarms'
                                                                                                }, 32
                                                                                            ]
                                                                                        }
                                                                                    }, 2
                                                                                ]
                                                                            }, 1
                                                                        ]
                                                                    },
                                                                    'then': {
                                                                        '$last': '$logintervals'
                                                                    },
                                                                    'else': 0
                                                                }
                                                            },
                                                            'in': {
                                                                '$add': [
                                                                    '$$value', '$$this'
                                                                ]
                                                            }
                                                        }
                                                    } }
                                                }
                                            }, {
                                                '$group': {
                                                    '_id': {
                                                        'deviceAddr': '$deviceAddr',
                                                        'hour': '$hour'
                                                    },
                                                    'numOfAlarms': {
                                                        '$sum': '$numOfAlarms'
                                                    },
                                                    'secOffWrist': {
                                                        '$sum': '$secOffWrist'
                                                    }
                                                }
                                            }, {
                                                '$group': {
                                                    '_id': {
                                                        'deviceAddr': '$_id.deviceAddr'
                                                    },
                                                    'data': {
                                                        '$push': {
                                                            'numOfAlarms': '$numOfAlarms',
                                                            'secOffWrist': '$secOffWrist',
                                                            'hour': '$_id.hour'
                                                        }
                                                    }
                                                }
                                            }, {
                                                '$project': {
                                                    'data': {
                                                        '$map': {
                                                            'input': {
                                                                '$range': [
                                                                    0, 24, 1
                                                                ]
                                                            },
                                                            'as': 'd',
                                                            'in': {
                                                                '$let': {
                                                                    'vars': {
                                                                        'dateIndex': {
                                                                            '$indexOfArray': [
                                                                                {
                                                                                    '$map': {
                                                                                        'input': '$data.hour',
                                                                                        'as': 't',
                                                                                        'in': '$$t'
                                                                                    }
                                                                                }, '$$d'
                                                                            ]
                                                                        }
                                                                    },
                                                                    'in': {
                                                                        '$cond': {
                                                                            'if': {
                                                                                '$ne': [
                                                                                    '$$dateIndex', -1
                                                                                ]
                                                                            },
                                                                            'then': {
                                                                                '$arrayElemAt': [
                                                                                    '$data', '$$dateIndex'
                                                                                ]
                                                                            },
                                                                            'else': {
                                                                                'numOfAlarms': 0,
                                                                                'secOffWrist': 0,
                                                                                'hour': '$$d'
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }, {
                                                '$group': {
                                                    '_id': None,
                                                    'reportByDevices': {
                                                        '$push': {
                                                            'dataByHour': '$data',
                                                            'deviceAddr': '$_id.deviceAddr'
                                                        }
                                                    }
                                                }
                                            }
                                        ]
            return self.__mongo_collection__.aggregate(pipelineRetrieveTotalReport, allowDiskUse=True, maxTimeMS=600000)
        except Exception as e:
            self.__logger__.error("Fail to get total report data with Exception: " + str(e))
            raise e


    def _get_report_per_day_data_predicts(self, fromReportDate: datetime, toReportDate: datetime):
        try:
            self.__logger__.info("Get per day reports data from date " + str(fromReportDate) + " to date " + str(toReportDate))
            pipelineRetrieveReports = [
                                        {
                                            '$match': {
                                                'sourceApp': 'PREDICTS',
                                                '$expr': {
                                                    '$and': [
                                                        {
                                                            '$gte': [
                                                                {
                                                                    '$toDate': '$currentDateHalf'
                                                                }, {
                                                                    '$toDate': fromReportDate
                                                                }
                                                            ]
                                                        }, {
                                                            '$lt': [
                                                                {
                                                                    '$toDate': '$currentDateHalf'
                                                                }, {
                                                                    '$toDate': toReportDate
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            }
                                        }, {
                                            '$unwind': '$data'
                                        }, {
                                            '$match': {
                                                'data.addictedData.TYPE': {
                                                    '$bitsAllSet': 2147483649
                                                }
                                            }
                                        }, {
                                            '$group': {
                                                '_id': {
                                                    'deviceAddr': '$deviceAddr',
                                                    'Time': '$data.addictedData.TIME',
                                                    'Type': '$data.addictedData.TYPE',
                                                    'DS': '$data.addictedData.DS'
                                                }
                                            }
                                        }, {
                                            '$sort': {
                                                '_id.deviceAddr': 1,
                                                '_id.Time': 1
                                            }
                                        }, {
                                            '$project': {
                                                '_id': None,
                                                'deviceAddr': '$_id.deviceAddr',
                                                'Time': {
                                                    '$dateFromString': {
                                                        'dateString': '$_id.Time',
                                                        'format': '%Y-%m-%d %H:%M:%S'
                                                    }
                                                },
                                                'DS': '$_id.DS'
                                            }
                                        }, {
                                            '$group': {
                                                '_id': {
                                                    'deviceAddr': '$deviceAddr',
                                                    'year': {
                                                        '$year': '$Time'
                                                    },
                                                    'month': {
                                                        '$month': '$Time'
                                                    },
                                                    'day': {
                                                        '$dayOfMonth': '$Time'
                                                    },
                                                    'hour': {
                                                        '$hour': '$Time'
                                                    }
                                                },
                                                'alarms': {
                                                    '$push': '$DS'
                                                },
                                                'timestamps': {
                                                    '$push': '$Time'
                                                }
                                            }
                                        }, {
                                            '$project': {
                                                '_id': None,
                                                'deviceAddr': '$_id.deviceAddr',
                                                'reportDate': {
                                                    '$dateFromParts': {
                                                        'year': '$_id.year',
                                                        'month': '$_id.month',
                                                        'day': '$_id.day'
                                                    }
                                                },
                                                'alarms': '$alarms',
                                                'logintervals': {
                                                    '$reduce': {
                                                        'input': {
                                                            '$range': [
                                                                1, {
                                                                    '$size': '$timestamps'
                                                                }
                                                            ]
                                                        },
                                                        'initialValue': [],
                                                        'in': {
                                                            '$concatArrays': [
                                                                '$$value', [
                                                                    {
                                                                        '$divide': [
                                                                            {
                                                                                '$subtract': [
                                                                                    {
                                                                                        '$arrayElemAt': [
                                                                                            '$timestamps', '$$this'
                                                                                        ]
                                                                                    }, {
                                                                                        '$arrayElemAt': [
                                                                                            '$timestamps', {
                                                                                                '$subtract': [
                                                                                                    '$$this', 1
                                                                                                ]
                                                                                            }
                                                                                        ]
                                                                                    }
                                                                                ]
                                                                            }, 1000
                                                                        ]
                                                                    }
                                                                ]
                                                            ]
                                                        }
                                                    }
                                                },
                                                'fromTime': {
                                                    '$dateFromParts': {
                                                        'year': '$_id.year',
                                                        'month': '$_id.month',
                                                        'day': '$_id.day',
                                                        'hour': '$_id.hour'
                                                    }
                                                },
                                                'toTime': {
                                                    '$dateFromParts': {
                                                        'year': '$_id.year',
                                                        'month': '$_id.month',
                                                        'day': '$_id.day',
                                                        'hour': '$_id.hour',
                                                        'minute': 59
                                                    }
                                                },
                                                'numOfAlarms': {
                                                    '$size': {
                                                        '$filter': {
                                                            'input': {
                                                                '$reduce': {
                                                                    'input': '$alarms',
                                                                    'initialValue': [],
                                                                    'in': {
                                                                        '$cond': {
                                                                            'if': {
                                                                                '$eq': [
                                                                                    {
                                                                                        '$arrayElemAt': [
                                                                                            '$$value', -1
                                                                                        ]
                                                                                    }, '$$this'
                                                                                ]
                                                                            },
                                                                            'then': '$$value',
                                                                            'else': {
                                                                                '$concatArrays': [
                                                                                    '$$value', [
                                                                                        '$$this'
                                                                                    ]
                                                                                ]
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            },
                                                            'as': 'element',
                                                            'cond': {
                                                                '$eq': [
                                                                    {
                                                                        '$mod': [
                                                                            {
                                                                                '$floor': {
                                                                                    '$divide': [
                                                                                        '$$element', 16
                                                                                    ]
                                                                                }
                                                                            }, 2
                                                                        ]
                                                                    }, 1
                                                                ]
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }, {
                                            '$project': {
                                                'deviceAddr': 1,
                                                'reportDate': 1,
                                                'numOfAlarms': 1,
                                                'toTime': 1,
                                                'fromTime': 1,
                                                'secOffWrist': {
                                                    '$toInt': {
                                                        '$reduce': {
                                                            'input': {
                                                                '$map': {
                                                                    'input': {
                                                                        '$range': [
                                                                            0, {
                                                                                '$size': '$logintervals'
                                                                            }
                                                                        ]
                                                                    },
                                                                    'as': 'index',
                                                                    'in': {
                                                                        '$cond': {
                                                                            'if': {
                                                                                '$eq': [
                                                                                    {
                                                                                        '$mod': [
                                                                                            {
                                                                                                '$floor': {
                                                                                                    '$divide': [
                                                                                                        {
                                                                                                            '$arrayElemAt': [
                                                                                                                '$alarms', '$$index'
                                                                                                            ]
                                                                                                        }, 32
                                                                                                    ]
                                                                                                }
                                                                                            }, 2
                                                                                        ]
                                                                                    }, 1
                                                                                ]
                                                                            },
                                                                            'then': {
                                                                                '$arrayElemAt': [
                                                                                    '$logintervals', '$$index'
                                                                                ]
                                                                            },
                                                                            'else': 0
                                                                        }
                                                                    }
                                                                }
                                                            },
                                                            'initialValue': {
                                                                '$cond': {
                                                                    'if': {
                                                                        '$eq': [
                                                                            {
                                                                                '$mod': [
                                                                                    {
                                                                                        '$floor': {
                                                                                            '$divide': [
                                                                                                {
                                                                                                    '$last': '$alarms'
                                                                                                }, 32
                                                                                            ]
                                                                                        }
                                                                                    }, 2
                                                                                ]
                                                                            }, 1
                                                                        ]
                                                                    },
                                                                    'then': {
                                                                        '$last': '$logintervals'
                                                                    },
                                                                    'else': 0
                                                                }
                                                            },
                                                            'in': {
                                                                '$add': [
                                                                    '$$value', '$$this'
                                                                ]
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }, {
                                            '$sort': {
                                                'fromTime': 1
                                            }
                                        }, {
                                            '$group': {
                                                '_id': {
                                                    'deviceAddr': '$deviceAddr',
                                                    'reportDate': '$reportDate'
                                                },
                                                'data': {
                                                    '$push': {
                                                        'numOfAlarms': '$numOfAlarms',
                                                        'secOffWrist': '$secOffWrist',
                                                        'fromTime': '$fromTime',
                                                        'toTime': '$toTime'
                                                    }
                                                }
                                            }
                                        }, {
                                            '$project': {
                                                'reportDate': '$_id.reportDate',
                                                'data': {
                                                    '$map': {
                                                        'input': {
                                                            '$range': [
                                                                0, 24, 1
                                                            ]
                                                        },
                                                        'as': 'd',
                                                        'in': {
                                                            '$let': {
                                                                'vars': {
                                                                    'dateIndex': {
                                                                        '$indexOfArray': [
                                                                            {
                                                                                '$map': {
                                                                                    'input': '$data.fromTime',
                                                                                    'as': 't',
                                                                                    'in': {
                                                                                        '$hour': '$$t'
                                                                                    }
                                                                                }
                                                                            }, '$$d'
                                                                        ]
                                                                    }
                                                                },
                                                                'in': {
                                                                    '$cond': {
                                                                        'if': {
                                                                            '$ne': [
                                                                                '$$dateIndex', -1
                                                                            ]
                                                                        },
                                                                        'then': {
                                                                            '$arrayElemAt': [
                                                                                '$data', '$$dateIndex'
                                                                            ]
                                                                        },
                                                                        'else': {
                                                                            'numOfAlarms': 0,
                                                                            'secOffWrist': 0,
                                                                            'fromTime': {
                                                                                '$dateFromParts': {
                                                                                    'year': {
                                                                                        '$year': '$_id.reportDate'
                                                                                    },
                                                                                    'month': {
                                                                                        '$month': '$_id.reportDate'
                                                                                    },
                                                                                    'day': {
                                                                                        '$dayOfMonth': '$_id.reportDate'
                                                                                    },
                                                                                    'hour': '$$d'
                                                                                }
                                                                            },
                                                                            'toTime': {
                                                                                '$dateFromParts': {
                                                                                    'year': {
                                                                                        '$year': '$_id.reportDate'
                                                                                    },
                                                                                    'month': {
                                                                                        '$month': '$_id.reportDate'
                                                                                    },
                                                                                    'day': {
                                                                                        '$dayOfMonth': '$_id.reportDate'
                                                                                    },
                                                                                    'hour': '$$d',
                                                                                    'minute': 59
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }, {
                                            '$group': {
                                                '_id': {
                                                    'reportDate': '$reportDate'
                                                },
                                                'reportByDevices': {
                                                    '$push': {
                                                        'dataByHour': '$data',
                                                        'deviceAddr': '$_id.deviceAddr'
                                                    }
                                                }
                                            }
                                        }, {
                                            '$project': {
                                                '_id': None,
                                                'reportByDevices': 1,
                                                'reportDate': '$_id.reportDate'
                                            }
                                        }, {
                                            '$sort': {
                                                'reportDate': 1
                                            }
                                        }
                                    ]
            return self.__mongo_collection__.aggregate(pipelineRetrieveReports, allowDiskUse=True, maxTimeMS=600000)
        except Exception as e:
            self.__logger__.error("Fail to get per day reports data with Exception: " + str(e))
            raise e


    def _write_total_report_predicts(self, fromReportDate: datetime, toReportDate: datetime):

        try:
            self.__logger__.info("Produce total report on file")
            try:
                total_report = self._get_report_total_data_predicts(fromReportDate=fromReportDate, toReportDate=toReportDate)
            except Exception as e:
                self.__logger__.error("Fail to get total report data with Exception: " + str(e))
                raise e

            totalReports = []
            for tot_report in total_report:
                reportName = "summary-report"
                indexdriverCol = ["Time Hours Slot", "Time Hours Slot"]
                subindexCol = ["Start time", "End time"]
                indexCol = []

                for reportByDevice in tot_report["reportByDevices"]:
                    indexdriverCol.extend(
                        ["Driver " + reportByDevice["deviceAddr"], "Driver " + reportByDevice["deviceAddr"]])
                    subindexCol.extend(["Alarms recorded", "Off-Wrist time", "Alarms recorded", "Off-Wrist time"])
                for index, subindex in zip(indexdriverCol, subindexCol):
                    indexCol.append((index, subindex))


                multiindexCol = pd.MultiIndex.from_tuples(indexCol)
                reportStartTime = [datetime.strptime(str(d["hour"]) + ":00:00", "%H:%M:%S").strftime("%H:%M:%S") for d in
                                   tot_report["reportByDevices"][0]["dataByHour"]]
                reportEndTime = [datetime.strptime(str(d["hour"]) + ":59:00", "%H:%M:%S").strftime("%H:%M:%S") for d in
                                 tot_report["reportByDevices"][0]["dataByHour"]]

                i = 0
                reportMatrix = [["" for _ in range(len(indexCol))] for _ in range(len(reportStartTime))]

                for i in range(0, 24, 1):
                    reportMatrix[i][0] = reportStartTime[i]
                    reportMatrix[i][1] = reportEndTime[i]

                i = 0
                j = 2

                for deviceData in tot_report["reportByDevices"]:
                    for data in deviceData["dataByHour"]:
                        reportMatrix[i][j] = str(data["numOfAlarms"])
                        reportMatrix[i][j + 1] = str(data["secOffWrist"])
                        i += 1
                    j += 2
                    i = 0

                df = pd.DataFrame(data=reportMatrix, columns=multiindexCol)
                totalReports.append((df, reportName))

            self.__logger__.info("Complete produce total report on file")
            return True, totalReports
        except Exception as e:
            self.__logger__.error("Fail to produce total report with Exception: " + str(e))
            return False, []

    def _write_per_day_reports_predicts(self, fromReportDate: datetime, toReportDate: datetime):
        try:
            self.__logger__.info("Write per day reports on file")
            try:
                reports = self._get_report_per_day_data_predicts(fromReportDate=fromReportDate, toReportDate=toReportDate)
            except Exception as e:
                self.__logger__.error("Fail to get per day report data with Exception: " + str(e))
                raise e

            dailyReports = []
            for report in reports:
                reportName = "report-" + report["reportDate"].strftime("%d-%m-%Y")
                indexdriverCol = ["Time Hours Slot", "Time Hours Slot"]
                subindexCol = ["Start time", "End time"]
                indexCol = []

                for reportByDevice in report["reportByDevices"]:
                    indexdriverCol.extend(
                        ["Driver " + reportByDevice["deviceAddr"], "Driver " + reportByDevice["deviceAddr"]])
                    subindexCol.extend(["Alarms recorded", "Off-Wrist time", "Alarms recorded", "Off-Wrist time"])
                for index, subindex in zip(indexdriverCol, subindexCol):
                    indexCol.append((index, subindex))

                multiindexCol = pd.MultiIndex.from_tuples(indexCol)

                reportStartTime = [d["fromTime"].strftime("%H:%M:%S") for d in report["reportByDevices"][0]["dataByHour"]]
                reportEndTime = [d["toTime"].strftime("%H:%M:%S") for d in report["reportByDevices"][0]["dataByHour"]]

                i = 0
                reportMatrix = [["" for _ in range(len(indexCol))] for _ in range(len(reportStartTime))]

                for i in range(0, 24, 1):
                    reportMatrix[i][0] = reportStartTime[i]
                    reportMatrix[i][1] = reportEndTime[i]
                i = 0
                j = 2
                for deviceData in report["reportByDevices"]:
                    for data in deviceData["dataByHour"]:
                        reportMatrix[i][j] = str(data["numOfAlarms"])
                        reportMatrix[i][j + 1] = str(data["secOffWrist"])
                        i += 1
                    j += 2
                    i = 0

                df = pd.DataFrame(data=reportMatrix, columns=multiindexCol)
                dailyReports.append((df, reportName))

            self.__logger__.info("Complete write per day reports on file")
            return True, dailyReports
        except Exception as e:
            self.__logger__.error("Fail to write per day report with Exception: " + str(e))
            return False, []


    def make_report_predicts(self, fromReportDate: datetime, toReportDate: datetime):

        self.__logger__.info("Make report file from date " + str(fromReportDate) + " to date " + str(toReportDate))

        try:
            self._connect()
        except Exception as e:
            raise e

        try:
            if not self._is_connected():
                self.__logger__.error("Unable to enstablish connection with MongoDB Server")
                raise Exception("Unable to enstablish connection with MongoDB Server")
        except Exception as e:
            raise e

        self.__logger__.debug("Connection to MongoDB server complete")

        try:
            report_output_path = os.getcwd() + "/report.xlsx"
            import concurrent.futures

            self.__logger__.debug("Detach data producer workers")
            with concurrent.futures.ThreadPoolExecutor(max_workers=2) as executor:
                future_per_day = executor.submit(self._write_per_day_reports_predicts, fromReportDate,
                                                 toReportDate)
                future_total = executor.submit(self._write_total_report_predicts, fromReportDate, toReportDate)
                result_per_day = future_per_day.result()
                result_total = future_total.result()

            self.__logger__.debug("Data producer workers end")

            if not result_total[0] or not result_per_day[0]:
                self.__logger__.error("Fail to make report file (reportPerDay=" + str(result_per_day[0]) + ", reportTotal=" + str(result_total[0]) + ")")
                raise Exception("Fail to make report file (reportPerDay=" + str(result_per_day[0]) + ", reportTotal=" + str(result_total[0]) + ")")

            self.__logger__.debug("Data producer workers end successfully")

            if len(result_total[1]) == 0 or len(result_per_day[1]) == 0:
                self.__logger__.debug("No data produced")
                raise ProducedEmptyReportException(message="Produced report is empty", errorcode=1)

            resultTotalData = result_total[1][0]
            resultDailyData = result_per_day[1]

            if len(resultTotalData) == 0 and len(resultDailyData) == 0:
                self.__logger__.debug("No data produced")
                raise ProducedEmptyReportException(message="Produced report is empty", errorcode=1)

            with pd.ExcelWriter(path=report_output_path, engine="xlsxwriter") as xlswriter:
                if isinstance(resultTotalData[0], pd.DataFrame) and isinstance(resultTotalData[1], str):
                    totalReport = resultTotalData[0]
                    totalReportName = resultTotalData[1]
                    self.__logger__.debug("Write total report " + str(totalReportName))
                    totalReport.to_excel(xlswriter, sheet_name=totalReportName)
                    xlswriter.sheets[totalReportName].autofit()
                for (dailyReport, dailyReportName) in resultDailyData:
                    if isinstance(dailyReport, pd.DataFrame) and isinstance(dailyReportName, str):
                        self.__logger__.debug("Write daily report " + str(dailyReportName))
                        dailyReport.to_excel(xlswriter, sheet_name=dailyReportName)
                        xlswriter.sheets[dailyReportName].autofit()
            self.__logger__.info("Complete make report file in " + str(report_output_path))
            return report_output_path
        except Exception as e:
            raise e









    def _get_report_total_data_predicts_v0(self, fromReportDate: datetime, toReportDate: datetime):
        try:
            self.__logger__.info("Get total report data from date " + str(fromReportDate) + " to date " + str(toReportDate))
            pipelineRetrieveTotalReport = [
                                            {
                                                '$match': {
                                                    'sourceApp': 'PREDICTS',
                                                    '$expr': {
                                                        '$and': [
                                                            {
                                                                '$ne': [
                                                                    '$deviceAddr', 'null'
                                                                ]
                                                            }, {
                                                                '$gte': [
                                                                    {
                                                                        '$toDate': '$currentDateHalf'
                                                                    }, {
                                                                        '$toDate': fromReportDate
                                                                    }
                                                                ]
                                                            }, {
                                                                '$lt': [
                                                                    {
                                                                        '$toDate': '$currentDateHalf'
                                                                    }, {
                                                                        '$toDate': toReportDate
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                }
                                            }, {
                                                '$unwind': '$data'
                                            }, {
                                                '$match': {
                                                    '$expr': {
                                                        '$ne': [
                                                            '$data.addictedData.Time', ''
                                                        ]
                                                    }
                                                }
                                            }, {
                                                '$group': {
                                                    '_id': {
                                                        'deviceAddr': '$deviceAddr',
                                                        'ds': '$data.addictedData.Drowsiness state',
                                                        'Time': {
                                                            '$dateFromString': {
                                                                'dateString': {
                                                                    '$concat': [
                                                                        {
                                                                            '$arrayElemAt': [
                                                                                {
                                                                                    '$split': [
                                                                                        '$data.addictedData.Time', ' '
                                                                                    ]
                                                                                }, 2
                                                                            ]
                                                                        }, '-', {
                                                                            '$switch': {
                                                                                'branches': [
                                                                                    {
                                                                                        'case': {
                                                                                            '$in': [
                                                                                                {
                                                                                                    '$toString': {
                                                                                                        '$arrayElemAt': [
                                                                                                            {
                                                                                                                '$split': [
                                                                                                                    '$data.addictedData.Time', ' '
                                                                                                                ]
                                                                                                            }, 1
                                                                                                        ]
                                                                                                    }
                                                                                                }, [
                                                                                                    'gen', 'Jan', 'Jan'
                                                                                                ]
                                                                                            ]
                                                                                        },
                                                                                        'then': '01'
                                                                                    }, {
                                                                                        'case': {
                                                                                            '$in': [
                                                                                                {
                                                                                                    '$toString': {
                                                                                                        '$arrayElemAt': [
                                                                                                            {
                                                                                                                '$split': [
                                                                                                                    '$data.addictedData.Time', ' '
                                                                                                                ]
                                                                                                            }, 1
                                                                                                        ]
                                                                                                    }
                                                                                                }, [
                                                                                                    'feb', 'Feb', 'Feb'
                                                                                                ]
                                                                                            ]
                                                                                        },
                                                                                        'then': '02'
                                                                                    }, {
                                                                                        'case': {
                                                                                            '$in': [
                                                                                                {
                                                                                                    '$toString': {
                                                                                                        '$arrayElemAt': [
                                                                                                            {
                                                                                                                '$split': [
                                                                                                                    '$data.addictedData.Time', ' '
                                                                                                                ]
                                                                                                            }, 1
                                                                                                        ]
                                                                                                    }
                                                                                                }, [
                                                                                                    'mar', 'Mar', 'Mär'
                                                                                                ]
                                                                                            ]
                                                                                        },
                                                                                        'then': '03'
                                                                                    }, {
                                                                                        'case': {
                                                                                            '$in': [
                                                                                                {
                                                                                                    '$toString': {
                                                                                                        '$arrayElemAt': [
                                                                                                            {
                                                                                                                '$split': [
                                                                                                                    '$data.addictedData.Time', ' '
                                                                                                                ]
                                                                                                            }, 1
                                                                                                        ]
                                                                                                    }
                                                                                                }, [
                                                                                                    'apr', 'Apr', 'Apr'
                                                                                                ]
                                                                                            ]
                                                                                        },
                                                                                        'then': '04'
                                                                                    }, {
                                                                                        'case': {
                                                                                            '$in': [
                                                                                                {
                                                                                                    '$toString': {
                                                                                                        '$arrayElemAt': [
                                                                                                            {
                                                                                                                '$split': [
                                                                                                                    '$data.addictedData.Time', ' '
                                                                                                                ]
                                                                                                            }, 1
                                                                                                        ]
                                                                                                    }
                                                                                                }, [
                                                                                                    'mag', 'May', 'Mai'
                                                                                                ]
                                                                                            ]
                                                                                        },
                                                                                        'then': '05'
                                                                                    }, {
                                                                                        'case': {
                                                                                            '$in': [
                                                                                                {
                                                                                                    '$toString': {
                                                                                                        '$arrayElemAt': [
                                                                                                            {
                                                                                                                '$split': [
                                                                                                                    '$data.addictedData.Time', ' '
                                                                                                                ]
                                                                                                            }, 1
                                                                                                        ]
                                                                                                    }
                                                                                                }, [
                                                                                                    'giu', 'Jun', 'Jun'
                                                                                                ]
                                                                                            ]
                                                                                        },
                                                                                        'then': '06'
                                                                                    }, {
                                                                                        'case': {
                                                                                            '$in': [
                                                                                                {
                                                                                                    '$toString': {
                                                                                                        '$arrayElemAt': [
                                                                                                            {
                                                                                                                '$split': [
                                                                                                                    '$data.addictedData.Time', ' '
                                                                                                                ]
                                                                                                            }, 1
                                                                                                        ]
                                                                                                    }
                                                                                                }, [
                                                                                                    'lug', 'Jul', 'Jul'
                                                                                                ]
                                                                                            ]
                                                                                        },
                                                                                        'then': '07'
                                                                                    }, {
                                                                                        'case': {
                                                                                            '$in': [
                                                                                                {
                                                                                                    '$toString': {
                                                                                                        '$arrayElemAt': [
                                                                                                            {
                                                                                                                '$split': [
                                                                                                                    '$data.addictedData.Time', ' '
                                                                                                                ]
                                                                                                            }, 1
                                                                                                        ]
                                                                                                    }
                                                                                                }, [
                                                                                                    'ago', 'Aug', 'Aug'
                                                                                                ]
                                                                                            ]
                                                                                        },
                                                                                        'then': '08'
                                                                                    }, {
                                                                                        'case': {
                                                                                            '$in': [
                                                                                                {
                                                                                                    '$toString': {
                                                                                                        '$arrayElemAt': [
                                                                                                            {
                                                                                                                '$split': [
                                                                                                                    '$data.addictedData.Time', ' '
                                                                                                                ]
                                                                                                            }, 1
                                                                                                        ]
                                                                                                    }
                                                                                                }, [
                                                                                                    'set', 'Sep', 'Sep'
                                                                                                ]
                                                                                            ]
                                                                                        },
                                                                                        'then': '09'
                                                                                    }, {
                                                                                        'case': {
                                                                                            '$in': [
                                                                                                {
                                                                                                    '$toString': {
                                                                                                        '$arrayElemAt': [
                                                                                                            {
                                                                                                                '$split': [
                                                                                                                    '$data.addictedData.Time', ' '
                                                                                                                ]
                                                                                                            }, 1
                                                                                                        ]
                                                                                                    }
                                                                                                }, [
                                                                                                    'ott', 'Oct', 'Okt'
                                                                                                ]
                                                                                            ]
                                                                                        },
                                                                                        'then': '10'
                                                                                    }, {
                                                                                        'case': {
                                                                                            '$in': [
                                                                                                {
                                                                                                    '$toString': {
                                                                                                        '$arrayElemAt': [
                                                                                                            {
                                                                                                                '$split': [
                                                                                                                    '$data.addictedData.Time', ' '
                                                                                                                ]
                                                                                                            }, 1
                                                                                                        ]
                                                                                                    }
                                                                                                }, [
                                                                                                    'nov', 'Nov', 'Nov'
                                                                                                ]
                                                                                            ]
                                                                                        },
                                                                                        'then': '11'
                                                                                    }, {
                                                                                        'case': {
                                                                                            '$in': [
                                                                                                {
                                                                                                    '$toString': {
                                                                                                        '$arrayElemAt': [
                                                                                                            {
                                                                                                                '$split': [
                                                                                                                    '$data.addictedData.Time', ' '
                                                                                                                ]
                                                                                                            }, 1
                                                                                                        ]
                                                                                                    }
                                                                                                }, [
                                                                                                    'dic', 'Dec', 'Dez'
                                                                                                ]
                                                                                            ]
                                                                                        },
                                                                                        'then': '12'
                                                                                    }
                                                                                ],
                                                                                'default': '01'
                                                                            }
                                                                        }, '-', {
                                                                            '$arrayElemAt': [
                                                                                {
                                                                                    '$split': [
                                                                                        '$data.addictedData.Time', ' '
                                                                                    ]
                                                                                }, 5
                                                                            ]
                                                                        }, 'T', {
                                                                            '$arrayElemAt': [
                                                                                {
                                                                                    '$split': [
                                                                                        '$data.addictedData.Time', ' '
                                                                                    ]
                                                                                }, 3
                                                                            ]
                                                                        }, {
                                                                            '$arrayElemAt': [
                                                                                {
                                                                                    '$split': [
                                                                                        '$data.addictedData.Time', ' '
                                                                                    ]
                                                                                }, 4
                                                                            ]
                                                                        }
                                                                    ]
                                                                },
                                                                'format': '%d-%m-%YT%H:%M:%S%z'
                                                            }
                                                        }
                                                    }
                                                }
                                            }, {
                                                '$sort': {
                                                    '_id.deviceAddr': 1,
                                                    '_id.Time': 1
                                                }
                                            }, {
                                                '$group': {
                                                    '_id': {
                                                        'deviceAddr': '$_id.deviceAddr',
                                                        'year': {
                                                            '$year': '$_id.Time'
                                                        },
                                                        'month': {
                                                            '$month': '$_id.Time'
                                                        },
                                                        'day': {
                                                            '$dayOfMonth': '$_id.Time'
                                                        },
                                                        'hour': {
                                                            '$hour': '$_id.Time'
                                                        }
                                                    },
                                                    'timestamps': {
                                                        '$push': '$_id.Time'
                                                    },
                                                    'alarms': {
                                                        '$push': '$_id.ds'
                                                    }
                                                }
                                            }, {
                                                '$project': {
                                                    '_id': None,
                                                    'deviceAddr': '$_id.deviceAddr',
                                                    'hour': '$_id.hour',
                                                    'alarms': 1,
                                                    'logintervals': {
                                                        '$reduce': {
                                                            'input': {
                                                                '$range': [
                                                                    1, {
                                                                        '$size': '$timestamps'
                                                                    }
                                                                ]
                                                            },
                                                            'initialValue': [],
                                                            'in': {
                                                                '$concatArrays': [
                                                                    '$$value', [
                                                                        {
                                                                            '$divide': [
                                                                                {
                                                                                    '$subtract': [
                                                                                        {
                                                                                            '$arrayElemAt': [
                                                                                                '$timestamps', '$$this'
                                                                                            ]
                                                                                        }, {
                                                                                            '$arrayElemAt': [
                                                                                                '$timestamps', {
                                                                                                    '$subtract': [
                                                                                                        '$$this', 1
                                                                                                    ]
                                                                                                }
                                                                                            ]
                                                                                        }
                                                                                    ]
                                                                                }, 1000
                                                                            ]
                                                                        }
                                                                    ]
                                                                ]
                                                            }
                                                        }
                                                    },
                                                    'fromTime': {
                                                        '$dateFromParts': {
                                                            'year': '$_id.year',
                                                            'month': '$_id.month',
                                                            'day': '$_id.day',
                                                            'hour': '$_id.hour'
                                                        }
                                                    },
                                                    'toTime': {
                                                        '$dateFromParts': {
                                                            'year': '$_id.year',
                                                            'month': '$_id.month',
                                                            'day': '$_id.day',
                                                            'hour': '$_id.hour',
                                                            'minute': 59
                                                        }
                                                    },
                                                    'numOfAlarms': {
                                                        '$size': {
                                                            '$filter': {
                                                                'input': {
                                                                    '$reduce': {
                                                                        'input': '$alarms',
                                                                        'initialValue': [],
                                                                        'in': {
                                                                            '$cond': {
                                                                                'if': {
                                                                                    '$eq': [
                                                                                        {
                                                                                            '$arrayElemAt': [
                                                                                                '$$value', -1
                                                                                            ]
                                                                                        }, '$$this'
                                                                                    ]
                                                                                },
                                                                                'then': '$$value',
                                                                                'else': {
                                                                                    '$concatArrays': [
                                                                                        '$$value', [
                                                                                            '$$this'
                                                                                        ]
                                                                                    ]
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                },
                                                                'as': 'element',
                                                                'cond': {
                                                                    '$eq': [
                                                                        '$$element', 'rKSS4'
                                                                    ]
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }, {
                                                '$project': {
                                                    'hour': 1,
                                                    'deviceAddr': 1,
                                                    'numOfAlarms': 1,
                                                    'toTime': 1,
                                                    'fromTime': 1,
                                                    'secOffWrist': { '$toInt': {
                                                        '$reduce': {
                                                            'input': {
                                                                '$map': {
                                                                    'input': {
                                                                        '$range': [
                                                                            0, {
                                                                                '$size': '$logintervals'
                                                                            }
                                                                        ]
                                                                    },
                                                                    'as': 'index',
                                                                    'in': {
                                                                        '$cond': {
                                                                            'if': {
                                                                                '$eq': [
                                                                                    {
                                                                                        '$arrayElemAt': [
                                                                                            '$alarms', '$$index'
                                                                                        ]
                                                                                    }, 'offwrist'
                                                                                ]
                                                                            },
                                                                            'then': {
                                                                                '$arrayElemAt': [
                                                                                    '$logintervals', '$$index'
                                                                                ]
                                                                            },
                                                                            'else': 0
                                                                        }
                                                                    }
                                                                }
                                                            },
                                                            'initialValue': {
                                                                '$cond': {
                                                                    'if': {
                                                                        '$eq': [
                                                                            {
                                                                                '$last': '$alarms'
                                                                            }, 'offwrist'
                                                                        ]
                                                                    },
                                                                    'then': {
                                                                        '$last': '$logintervals'
                                                                    },
                                                                    'else': 0
                                                                }
                                                            },
                                                            'in': {
                                                                '$add': [
                                                                    '$$value', '$$this'
                                                                ]
                                                            }
                                                        }
                                                    } }
                                                }
                                            }, {
                                                '$sort': {
                                                    'fromTime': 1
                                                }
                                            }, {
                                                '$match': {
                                                    '$expr': {
                                                        '$ne': [
                                                            '$hour', None
                                                        ]
                                                    }
                                                }
                                            }, {
                                                '$group': {
                                                    '_id': {
                                                        'deviceAddr': '$deviceAddr',
                                                        'hour': '$hour'
                                                    },
                                                    'numOfAlarms': {
                                                        '$sum': '$numOfAlarms'
                                                    },
                                                    'secOffWrist': {
                                                        '$sum': '$secOffWrist'
                                                    }
                                                }
                                            }, {
                                                '$group': {
                                                    '_id': {
                                                        'deviceAddr': '$_id.deviceAddr'
                                                    },
                                                    'data': {
                                                        '$push': {
                                                            'numOfAlarms': '$numOfAlarms',
                                                            'secOffWrist': '$secOffWrist',
                                                            'hour': '$_id.hour'
                                                        }
                                                    }
                                                }
                                            }, {
                                                '$project': {
                                                    'data': {
                                                        '$map': {
                                                            'input': {
                                                                '$range': [
                                                                    0, 24, 1
                                                                ]
                                                            },
                                                            'as': 'd',
                                                            'in': {
                                                                '$let': {
                                                                    'vars': {
                                                                        'dateIndex': {
                                                                            '$indexOfArray': [
                                                                                {
                                                                                    '$map': {
                                                                                        'input': '$data.hour',
                                                                                        'as': 't',
                                                                                        'in': '$$t'
                                                                                    }
                                                                                }, '$$d'
                                                                            ]
                                                                        }
                                                                    },
                                                                    'in': {
                                                                        '$cond': {
                                                                            'if': {
                                                                                '$ne': [
                                                                                    '$$dateIndex', -1
                                                                                ]
                                                                            },
                                                                            'then': {
                                                                                '$arrayElemAt': [
                                                                                    '$data', '$$dateIndex'
                                                                                ]
                                                                            },
                                                                            'else': {
                                                                                'numOfAlarms': 0,
                                                                                'secOffWrist': 0,
                                                                                'hour': '$$d'
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }, {
                                                '$group': {
                                                    '_id': None,
                                                    'reportByDevices': {
                                                        '$push': {
                                                            'dataByHour': '$data',
                                                            'deviceAddr': '$_id.deviceAddr'
                                                        }
                                                    }
                                                }
                                            }
                                        ]
            return self.__mongo_collection__.aggregate(pipelineRetrieveTotalReport, allowDiskUse=True, maxTimeMS=600000)
        except Exception as e:
            self.__logger__.error("Fail to get total report data with Exception: " + str(e))
            raise e


    def _get_report_per_day_data_predicts_v0(self, fromReportDate: datetime, toReportDate: datetime):
        try:
            pipelineRetrieveReports = [
                                        {
                                            '$match': {
                                                'sourceApp': 'PREDICTS',
                                                '$expr': {
                                                    '$and': [
                                                        {
                                                            '$ne': [
                                                                '$deviceAddr', 'null'
                                                            ]
                                                        }, {
                                                            '$gte': [
                                                                {
                                                                    '$toDate': '$currentDateHalf'
                                                                }, {
                                                                    '$toDate': fromReportDate
                                                                }
                                                            ]
                                                        }, {
                                                            '$lt': [
                                                                {
                                                                    '$toDate': '$currentDateHalf'
                                                                }, {
                                                                    '$toDate': toReportDate
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            }
                                        }, {
                                            '$unwind': '$data'
                                        }, {
                                            '$match': {
                                                '$expr': {
                                                    '$ne': [
                                                        '$data.addictedData.Time', ''
                                                    ]
                                                }
                                            }
                                        }, {
                                            '$group': {
                                                '_id': {
                                                    'deviceAddr': '$deviceAddr',
                                                    'ds': '$data.addictedData.Drowsiness state',
                                                    'Time': {
                                                        '$dateFromString': {
                                                            'dateString': {
                                                                '$concat': [
                                                                    {
                                                                        '$arrayElemAt': [
                                                                            {
                                                                                '$split': [
                                                                                    '$data.addictedData.Time', ' '
                                                                                ]
                                                                            }, 2
                                                                        ]
                                                                    }, '-', {
                                                                        '$switch': {
                                                                            'branches': [
                                                                                {
                                                                                    'case': {
                                                                                        '$in': [
                                                                                            {
                                                                                                '$toString': {
                                                                                                    '$arrayElemAt': [
                                                                                                        {
                                                                                                            '$split': [
                                                                                                                '$data.addictedData.Time', ' '
                                                                                                            ]
                                                                                                        }, 1
                                                                                                    ]
                                                                                                }
                                                                                            }, [
                                                                                                'gen', 'Jan', 'Jan'
                                                                                            ]
                                                                                        ]
                                                                                    },
                                                                                    'then': '01'
                                                                                }, {
                                                                                    'case': {
                                                                                        '$in': [
                                                                                            {
                                                                                                '$toString': {
                                                                                                    '$arrayElemAt': [
                                                                                                        {
                                                                                                            '$split': [
                                                                                                                '$data.addictedData.Time', ' '
                                                                                                            ]
                                                                                                        }, 1
                                                                                                    ]
                                                                                                }
                                                                                            }, [
                                                                                                'feb', 'Feb', 'Feb'
                                                                                            ]
                                                                                        ]
                                                                                    },
                                                                                    'then': '02'
                                                                                }, {
                                                                                    'case': {
                                                                                        '$in': [
                                                                                            {
                                                                                                '$toString': {
                                                                                                    '$arrayElemAt': [
                                                                                                        {
                                                                                                            '$split': [
                                                                                                                '$data.addictedData.Time', ' '
                                                                                                            ]
                                                                                                        }, 1
                                                                                                    ]
                                                                                                }
                                                                                            }, [
                                                                                                'mar', 'Mar', 'Mär'
                                                                                            ]
                                                                                        ]
                                                                                    },
                                                                                    'then': '03'
                                                                                }, {
                                                                                    'case': {
                                                                                        '$in': [
                                                                                            {
                                                                                                '$toString': {
                                                                                                    '$arrayElemAt': [
                                                                                                        {
                                                                                                            '$split': [
                                                                                                                '$data.addictedData.Time', ' '
                                                                                                            ]
                                                                                                        }, 1
                                                                                                    ]
                                                                                                }
                                                                                            }, [
                                                                                                'apr', 'Apr', 'Apr'
                                                                                            ]
                                                                                        ]
                                                                                    },
                                                                                    'then': '04'
                                                                                }, {
                                                                                    'case': {
                                                                                        '$in': [
                                                                                            {
                                                                                                '$toString': {
                                                                                                    '$arrayElemAt': [
                                                                                                        {
                                                                                                            '$split': [
                                                                                                                '$data.addictedData.Time', ' '
                                                                                                            ]
                                                                                                        }, 1
                                                                                                    ]
                                                                                                }
                                                                                            }, [
                                                                                                'mag', 'May', 'Mai'
                                                                                            ]
                                                                                        ]
                                                                                    },
                                                                                    'then': '05'
                                                                                }, {
                                                                                    'case': {
                                                                                        '$in': [
                                                                                            {
                                                                                                '$toString': {
                                                                                                    '$arrayElemAt': [
                                                                                                        {
                                                                                                            '$split': [
                                                                                                                '$data.addictedData.Time', ' '
                                                                                                            ]
                                                                                                        }, 1
                                                                                                    ]
                                                                                                }
                                                                                            }, [
                                                                                                'giu', 'Jun', 'Jun'
                                                                                            ]
                                                                                        ]
                                                                                    },
                                                                                    'then': '06'
                                                                                }, {
                                                                                    'case': {
                                                                                        '$in': [
                                                                                            {
                                                                                                '$toString': {
                                                                                                    '$arrayElemAt': [
                                                                                                        {
                                                                                                            '$split': [
                                                                                                                '$data.addictedData.Time', ' '
                                                                                                            ]
                                                                                                        }, 1
                                                                                                    ]
                                                                                                }
                                                                                            }, [
                                                                                                'lug', 'Jul', 'Jul'
                                                                                            ]
                                                                                        ]
                                                                                    },
                                                                                    'then': '07'
                                                                                }, {
                                                                                    'case': {
                                                                                        '$in': [
                                                                                            {
                                                                                                '$toString': {
                                                                                                    '$arrayElemAt': [
                                                                                                        {
                                                                                                            '$split': [
                                                                                                                '$data.addictedData.Time', ' '
                                                                                                            ]
                                                                                                        }, 1
                                                                                                    ]
                                                                                                }
                                                                                            }, [
                                                                                                'ago', 'Aug', 'Aug'
                                                                                            ]
                                                                                        ]
                                                                                    },
                                                                                    'then': '08'
                                                                                }, {
                                                                                    'case': {
                                                                                        '$in': [
                                                                                            {
                                                                                                '$toString': {
                                                                                                    '$arrayElemAt': [
                                                                                                        {
                                                                                                            '$split': [
                                                                                                                '$data.addictedData.Time', ' '
                                                                                                            ]
                                                                                                        }, 1
                                                                                                    ]
                                                                                                }
                                                                                            }, [
                                                                                                'set', 'Sep', 'Sep'
                                                                                            ]
                                                                                        ]
                                                                                    },
                                                                                    'then': '09'
                                                                                }, {
                                                                                    'case': {
                                                                                        '$in': [
                                                                                            {
                                                                                                '$toString': {
                                                                                                    '$arrayElemAt': [
                                                                                                        {
                                                                                                            '$split': [
                                                                                                                '$data.addictedData.Time', ' '
                                                                                                            ]
                                                                                                        }, 1
                                                                                                    ]
                                                                                                }
                                                                                            }, [
                                                                                                'ott', 'Oct', 'Okt'
                                                                                            ]
                                                                                        ]
                                                                                    },
                                                                                    'then': '10'
                                                                                }, {
                                                                                    'case': {
                                                                                        '$in': [
                                                                                            {
                                                                                                '$toString': {
                                                                                                    '$arrayElemAt': [
                                                                                                        {
                                                                                                            '$split': [
                                                                                                                '$data.addictedData.Time', ' '
                                                                                                            ]
                                                                                                        }, 1
                                                                                                    ]
                                                                                                }
                                                                                            }, [
                                                                                                'nov', 'Nov', 'Nov'
                                                                                            ]
                                                                                        ]
                                                                                    },
                                                                                    'then': '11'
                                                                                }, {
                                                                                    'case': {
                                                                                        '$in': [
                                                                                            {
                                                                                                '$toString': {
                                                                                                    '$arrayElemAt': [
                                                                                                        {
                                                                                                            '$split': [
                                                                                                                '$data.addictedData.Time', ' '
                                                                                                            ]
                                                                                                        }, 1
                                                                                                    ]
                                                                                                }
                                                                                            }, [
                                                                                                'dic', 'Dec', 'Dez'
                                                                                            ]
                                                                                        ]
                                                                                    },
                                                                                    'then': '12'
                                                                                }
                                                                            ],
                                                                            'default': '01'
                                                                        }
                                                                    }, '-', {
                                                                        '$arrayElemAt': [
                                                                            {
                                                                                '$split': [
                                                                                    '$data.addictedData.Time', ' '
                                                                                ]
                                                                            }, 5
                                                                        ]
                                                                    }, 'T', {
                                                                        '$arrayElemAt': [
                                                                            {
                                                                                '$split': [
                                                                                    '$data.addictedData.Time', ' '
                                                                                ]
                                                                            }, 3
                                                                        ]
                                                                    }, {
                                                                        '$arrayElemAt': [
                                                                            {
                                                                                '$split': [
                                                                                    '$data.addictedData.Time', ' '
                                                                                ]
                                                                            }, 4
                                                                        ]
                                                                    }
                                                                ]
                                                            },
                                                            'format': '%d-%m-%YT%H:%M:%S%z'
                                                        }
                                                    }
                                                }
                                            }
                                        }, {
                                            '$sort': {
                                                '_id.deviceAddr': 1,
                                                '_id.Time': 1
                                            }
                                        }, {
                                            '$group': {
                                                '_id': {
                                                    'deviceAddr': '$_id.deviceAddr',
                                                    'year': {
                                                        '$year': '$_id.Time'
                                                    },
                                                    'month': {
                                                        '$month': '$_id.Time'
                                                    },
                                                    'day': {
                                                        '$dayOfMonth': '$_id.Time'
                                                    },
                                                    'hour': {
                                                        '$hour': '$_id.Time'
                                                    }
                                                },
                                                'timestamps': {
                                                    '$push': '$_id.Time'
                                                },
                                                'alarms': {
                                                    '$push': '$_id.ds'
                                                }
                                            }
                                        }, {
                                            '$project': {
                                                '_id': None,
                                                'deviceAddr': '$_id.deviceAddr',
                                                'reportDate': {
                                                    '$dateFromParts': {
                                                        'year': '$_id.year',
                                                        'month': '$_id.month',
                                                        'day': '$_id.day'
                                                    }
                                                },
                                                'alarms': 1,
                                                'logintervals': {
                                                    '$reduce': {
                                                        'input': {
                                                            '$range': [
                                                                1, {
                                                                    '$size': '$timestamps'
                                                                }
                                                            ]
                                                        },
                                                        'initialValue': [],
                                                        'in': {
                                                            '$concatArrays': [
                                                                '$$value', [
                                                                    {
                                                                        '$divide': [
                                                                            {
                                                                                '$subtract': [
                                                                                    {
                                                                                        '$arrayElemAt': [
                                                                                            '$timestamps', '$$this'
                                                                                        ]
                                                                                    }, {
                                                                                        '$arrayElemAt': [
                                                                                            '$timestamps', {
                                                                                                '$subtract': [
                                                                                                    '$$this', 1
                                                                                                ]
                                                                                            }
                                                                                        ]
                                                                                    }
                                                                                ]
                                                                            }, 1000
                                                                        ]
                                                                    }
                                                                ]
                                                            ]
                                                        }
                                                    }
                                                },
                                                'fromTime': {
                                                    '$dateFromParts': {
                                                        'year': '$_id.year',
                                                        'month': '$_id.month',
                                                        'day': '$_id.day',
                                                        'hour': '$_id.hour'
                                                    }
                                                },
                                                'toTime': {
                                                    '$dateFromParts': {
                                                        'year': '$_id.year',
                                                        'month': '$_id.month',
                                                        'day': '$_id.day',
                                                        'hour': '$_id.hour',
                                                        'minute': 59
                                                    }
                                                },
                                                'numOfAlarms': {
                                                    '$size': {
                                                        '$filter': {
                                                            'input': {
                                                                '$reduce': {
                                                                    'input': '$alarms',
                                                                    'initialValue': [],
                                                                    'in': {
                                                                        '$cond': {
                                                                            'if': {
                                                                                '$eq': [
                                                                                    {
                                                                                        '$arrayElemAt': [
                                                                                            '$$value', -1
                                                                                        ]
                                                                                    }, '$$this'
                                                                                ]
                                                                            },
                                                                            'then': '$$value',
                                                                            'else': {
                                                                                '$concatArrays': [
                                                                                    '$$value', [
                                                                                        '$$this'
                                                                                    ]
                                                                                ]
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            },
                                                            'as': 'element',
                                                            'cond': {
                                                                '$eq': [
                                                                    '$$element', 'rKSS4'
                                                                ]
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }, {
                                            '$project': {
                                                'deviceAddr': 1,
                                                'reportDate': 1,
                                                'numOfAlarms': 1,
                                                'toTime': 1,
                                                'fromTime': 1,
                                                'secOffWrist': { '$toInt': {
                                                    '$reduce': {
                                                        'input': {
                                                            '$map': {
                                                                'input': {
                                                                    '$range': [
                                                                        0, {
                                                                            '$size': '$logintervals'
                                                                        }
                                                                    ]
                                                                },
                                                                'as': 'index',
                                                                'in': {
                                                                    '$cond': {
                                                                        'if': {
                                                                            '$eq': [
                                                                                {
                                                                                    '$arrayElemAt': [
                                                                                        '$alarms', '$$index'
                                                                                    ]
                                                                                }, 'offwrist'
                                                                            ]
                                                                        },
                                                                        'then': {
                                                                            '$arrayElemAt': [
                                                                                '$logintervals', '$$index'
                                                                            ]
                                                                        },
                                                                        'else': 0
                                                                    }
                                                                }
                                                            }
                                                        },
                                                        'initialValue': {
                                                            '$cond': {
                                                                'if': {
                                                                    '$eq': [
                                                                        {
                                                                            '$last': '$alarms'
                                                                        }, 'offwrist'
                                                                    ]
                                                                },
                                                                'then': {
                                                                    '$last': '$logintervals'
                                                                },
                                                                'else': 0
                                                            }
                                                        },
                                                        'in': {
                                                            '$add': [
                                                                '$$value', '$$this'
                                                            ]
                                                        }
                                                    }
                                                } }
                                            }
                                        }, {
                                            '$sort': {
                                                'fromTime': 1
                                            }
                                        }, {
                                            '$match': {
                                                '$expr': {
                                                    '$ne': [
                                                        '$reportDate', None
                                                    ]
                                                }
                                            }
                                        }, {
                                            '$group': {
                                                '_id': {
                                                    'deviceAddr': '$deviceAddr',
                                                    'reportDate': '$reportDate'
                                                },
                                                'data': {
                                                    '$push': {
                                                        'numOfAlarms': '$numOfAlarms',
                                                        'secOffWrist': '$secOffWrist',
                                                        'fromTime': '$fromTime',
                                                        'toTime': '$toTime'
                                                    }
                                                }
                                            }
                                        }, {
                                            '$project': {
                                                'reportDate': '$_id.reportDate',
                                                'data': {
                                                    '$map': {
                                                        'input': {
                                                            '$range': [
                                                                0, 24, 1
                                                            ]
                                                        },
                                                        'as': 'd',
                                                        'in': {
                                                            '$let': {
                                                                'vars': {
                                                                    'dateIndex': {
                                                                        '$indexOfArray': [
                                                                            {
                                                                                '$map': {
                                                                                    'input': '$data.fromTime',
                                                                                    'as': 't',
                                                                                    'in': {
                                                                                        '$hour': '$$t'
                                                                                    }
                                                                                }
                                                                            }, '$$d'
                                                                        ]
                                                                    }
                                                                },
                                                                'in': {
                                                                    '$cond': {
                                                                        'if': {
                                                                            '$ne': [
                                                                                '$$dateIndex', -1
                                                                            ]
                                                                        },
                                                                        'then': {
                                                                            '$arrayElemAt': [
                                                                                '$data', '$$dateIndex'
                                                                            ]
                                                                        },
                                                                        'else': {
                                                                            'numOfAlarms': 0,
                                                                            'secOffWrist': 0,
                                                                            'fromTime': {
                                                                                '$dateFromParts': {
                                                                                    'year': {
                                                                                        '$year': '$_id.reportDate'
                                                                                    },
                                                                                    'month': {
                                                                                        '$month': '$_id.reportDate'
                                                                                    },
                                                                                    'day': {
                                                                                        '$dayOfMonth': '$_id.reportDate'
                                                                                    },
                                                                                    'hour': '$$d'
                                                                                }
                                                                            },
                                                                            'toTime': {
                                                                                '$dateFromParts': {
                                                                                    'year': {
                                                                                        '$year': '$_id.reportDate'
                                                                                    },
                                                                                    'month': {
                                                                                        '$month': '$_id.reportDate'
                                                                                    },
                                                                                    'day': {
                                                                                        '$dayOfMonth': '$_id.reportDate'
                                                                                    },
                                                                                    'hour': '$$d',
                                                                                    'minute': 59
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }, {
                                            '$group': {
                                                '_id': {
                                                    'reportDate': '$reportDate'
                                                },
                                                'reportByDevices': {
                                                    '$push': {
                                                        'dataByHour': '$data',
                                                        'deviceAddr': '$_id.deviceAddr'
                                                    }
                                                }
                                            }
                                        }, {
                                            '$project': {
                                                '_id': None,
                                                'reportByDevices': 1,
                                                'reportDate': '$_id.reportDate'
                                            }
                                        }, {
                                            '$sort': {
                                                'reportDate': 1
                                            }
                                        }
                                    ]
            self.__logger__.info("Get per day reports data from date " + str(fromReportDate) + " to date " + str(toReportDate))
            return self.__mongo_collection__.aggregate(pipelineRetrieveReports, allowDiskUse=True, maxTimeMS=600000)
        except Exception as e:
            self.__logger__.error("Fail to get per day reports data with Exception: " + str(e))
            raise e


    def _write_total_report_predicts_v0(self, fromReportDate: datetime, toReportDate: datetime):

        try:
            self.__logger__.info("Produce total report on file")
            try:
                total_report = self._get_report_total_data_predicts_v0(fromReportDate=fromReportDate, toReportDate=toReportDate)
            except Exception as e:
                self.__logger__.error("Fail to get total report data with Exception: " + str(e))
                raise e

            totalReports = []
            for tot_report in total_report:
                reportName = "summary-report"
                indexdriverCol = ["Time Hours Slot", "Time Hours Slot"]
                subindexCol = ["Start time", "End time"]
                indexCol = []

                for reportByDevice in tot_report["reportByDevices"]:
                    indexdriverCol.extend(
                        ["Driver " + reportByDevice["deviceAddr"], "Driver " + reportByDevice["deviceAddr"]])
                    subindexCol.extend(["Alarms recorded", "Off-Wrist time", "Alarms recorded", "Off-Wrist time"])
                for index, subindex in zip(indexdriverCol, subindexCol):
                    indexCol.append((index, subindex))


                multiindexCol = pd.MultiIndex.from_tuples(indexCol)
                reportStartTime = [datetime.strptime(str(d["hour"]) + ":00:00", "%H:%M:%S").strftime("%H:%M:%S") for d in
                                   tot_report["reportByDevices"][0]["dataByHour"]]
                reportEndTime = [datetime.strptime(str(d["hour"]) + ":59:00", "%H:%M:%S").strftime("%H:%M:%S") for d in
                                 tot_report["reportByDevices"][0]["dataByHour"]]

                i = 0
                reportMatrix = [["" for _ in range(len(indexCol))] for _ in range(len(reportStartTime))]

                for i in range(0, 24, 1):
                    reportMatrix[i][0] = reportStartTime[i]
                    reportMatrix[i][1] = reportEndTime[i]

                i = 0
                j = 2

                for deviceData in tot_report["reportByDevices"]:
                    for data in deviceData["dataByHour"]:
                        reportMatrix[i][j] = str(data["numOfAlarms"])
                        reportMatrix[i][j + 1] = str(data["secOffWrist"])
                        i += 1
                    j += 2
                    i = 0

                df = pd.DataFrame(data=reportMatrix, columns=multiindexCol)
                totalReports.append((df, reportName))

            self.__logger__.info("Complete produce total report on file")
            return True, totalReports
        except Exception as e:
            self.__logger__.error("Fail to produce total report with Exception: " + str(e))
            return False, []

    def _write_per_day_reports_predicts_v0(self, fromReportDate: datetime, toReportDate: datetime):
        try:
            self.__logger__.info("Write per day reports on file")
            try:
                reports = self._get_report_per_day_data_predicts_v0(fromReportDate=fromReportDate, toReportDate=toReportDate)
            except Exception as e:
                self.__logger__.error("Fail to get per day report data with Exception: " + str(e))
                raise e

            dailyReports = []
            for report in reports:
                reportName = "report-" + report["reportDate"].strftime("%d-%m-%Y")
                indexdriverCol = ["Time Hours Slot", "Time Hours Slot"]
                subindexCol = ["Start time", "End time"]
                indexCol = []

                for reportByDevice in report["reportByDevices"]:
                    indexdriverCol.extend(
                        ["Driver " + reportByDevice["deviceAddr"], "Driver " + reportByDevice["deviceAddr"]])
                    subindexCol.extend(["Alarms recorded", "Off-Wrist time", "Alarms recorded", "Off-Wrist time"])
                for index, subindex in zip(indexdriverCol, subindexCol):
                    indexCol.append((index, subindex))

                multiindexCol = pd.MultiIndex.from_tuples(indexCol)

                reportStartTime = [d["fromTime"].strftime("%H:%M:%S") for d in report["reportByDevices"][0]["dataByHour"]]
                reportEndTime = [d["toTime"].strftime("%H:%M:%S") for d in report["reportByDevices"][0]["dataByHour"]]

                i = 0
                reportMatrix = [["" for _ in range(len(indexCol))] for _ in range(len(reportStartTime))]

                for i in range(0, 24, 1):
                    reportMatrix[i][0] = reportStartTime[i]
                    reportMatrix[i][1] = reportEndTime[i]
                i = 0
                j = 2
                for deviceData in report["reportByDevices"]:
                    for data in deviceData["dataByHour"]:
                        reportMatrix[i][j] = str(data["numOfAlarms"])
                        reportMatrix[i][j + 1] = str(data["secOffWrist"])
                        i += 1
                    j += 2
                    i = 0

                df = pd.DataFrame(data=reportMatrix, columns=multiindexCol)
                dailyReports.append((df, reportName))

            self.__logger__.info("Complete write per day reports on file")
            return True, dailyReports
        except Exception as e:
            self.__logger__.error("Fail to write per day report with Exception: " + str(e))
            return False, []


    def make_report_predicts_v0(self, fromReportDate: datetime, toReportDate: datetime):

        self.__logger__.info("Make report file from date " + str(fromReportDate) + " to date " + str(toReportDate))

        try:
            self._connect()
        except Exception as e:
            raise e

        try:
            if not self._is_connected():
                self.__logger__.error("Unable to enstablish connection with MongoDB Server")
                raise Exception("Unable to enstablish connection with MongoDB Server")
        except Exception as e:
            raise e

        self.__logger__.debug("Connection to MongoDB server complete")

        try:
            report_output_path = os.getcwd() + "/report.xlsx"
            import concurrent.futures

            self.__logger__.debug("Detach data producer workers")
            with concurrent.futures.ThreadPoolExecutor(max_workers=2) as executor:
                future_per_day = executor.submit(self._write_per_day_reports_predicts_v0, fromReportDate,
                                                 toReportDate)
                future_total = executor.submit(self._write_total_report_predicts_v0, fromReportDate, toReportDate)
                result_per_day = future_per_day.result()
                result_total = future_total.result()

            self.__logger__.debug("Data producer workers end")

            if not result_total[0] or not result_per_day[0]:
                self.__logger__.error("Fail to make report file (reportPerDay=" + str(result_per_day[0]) + ", reportTotal=" + str(result_total[0]) + ")")
                raise Exception("Fail to make report file (reportPerDay=" + str(result_per_day[0]) + ", reportTotal=" + str(result_total[0]) + ")")

            self.__logger__.debug("Data producer workers end successfully")


            if len(result_total[1]) == 0 or len(result_per_day[1]) == 0:
                self.__logger__.debug("No data produced")
                raise ProducedEmptyReportException(message="Produced report is empty", errorcode=1)

            resultTotalData = result_total[1][0]
            resultDailyData = result_per_day[1]

            with pd.ExcelWriter(path=report_output_path, engine="xlsxwriter") as xlswriter:
                if isinstance(resultTotalData[0], pd.DataFrame) and isinstance(resultTotalData[1], str):
                    totalReport = resultTotalData[0]
                    totalReportName = resultTotalData[1]
                    self.__logger__.debug("Write total report " + str(totalReportName))
                    totalReport.to_excel(xlswriter, sheet_name=totalReportName)
                    xlswriter.sheets[totalReportName].autofit()
                for (dailyReport, dailyReportName) in resultDailyData:
                    if isinstance(dailyReport, pd.DataFrame) and isinstance(dailyReportName, str):
                        self.__logger__.debug("Write daily report " + str(dailyReportName))
                        dailyReport.to_excel(xlswriter, sheet_name=dailyReportName)
                        xlswriter.sheets[dailyReportName].autofit()
            self.__logger__.info("Complete make report file in " + str(report_output_path))
            return report_output_path
        except Exception as e:
            raise e