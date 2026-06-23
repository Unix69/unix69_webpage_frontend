#Importing libraries
from AIU.AI_Unit import AI_Unit
import datetime
import numpy as np
import pymongo
from typing import List
from typing import Dict
import time
import json
import os
import subprocess

#Load Local Configuration
Configuration = json.load(open('Configuration.json'))

#Start AIU
AIU = AI_Unit(mongo_string=Configuration['mongo_string'],
              predictor_recover_directory=Configuration['predictor_recover_directory'],
              dataloge=Configuration['dataloge'], trained=Configuration['trained'],
              column_names=Configuration['column_names'], predicted_features=Configuration['predicted_features'],
              nmin_datasets_for_train=Configuration['nmin_datasets_for_train'], nmin_dataset_for_test=Configuration['nmin_dataset_for_test'],
              nmax_dataset_for_test=Configuration['nmax_dataset_for_test'], raw_db=Configuration['raw_db'], info_db=Configuration['info_db'],
              rawdataset_collection=Configuration['rawdataset_collection'], trainset_collection=Configuration['trainset_collection'],
              testresult_collection=Configuration['testresult_collection'], performance_collection=Configuration['performance_collection'],
              configuration_collection=Configuration['configuration_collection'],
              windows=Configuration['windows'], random_state=Configuration['random_state'], n_estimators=Configuration['n_estimators'], max_features=Configuration['max_features'])

AIU.Run()