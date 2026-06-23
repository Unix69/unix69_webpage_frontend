from datetime import datetime
import numpy as np
import pymongo
from typing import List
from typing import Dict
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import LinearRegression, LogisticRegression
from sklearn.tree import DecisionTreeRegressor
import joblib
import os
import fnmatch
import threading
import time
import sys
from AIU.Logger import Logger


# Predictor created by the AIU 
class Predictor:
    def __init__(self, model_recover_directory: str, model_recover_filename: str, predicted_feature: int, testresult_collection: pymongo.collection.Collection,
                 random_state, n_estimators, max_features):
        self.__rf__ = RandomForestRegressor(random_state=random_state, n_estimators=n_estimators,
                                            max_features=max_features)
        self.__trained__ = False
        self.__test_result_collection__ = testresult_collection
        self.__predicted_feature__ = predicted_feature
        self.__model_recover_directory__ = model_recover_directory
        self.__model_recover_filename__ = model_recover_filename

    # Select label to predict
    def SelectLabel(self, dataset: List[List[float]]):
        try:
            data_array = np.array(dataset)
            return list(data_array[:, self.__predicted_feature__])
        except Exception as e:
            Logger.CmdLogger(e.__str__())
            raise e

    # Select features
    def SelectFeatures(self, dataset):
        try:
            features = []
            data_array = np.array(dataset)
            features_array = np.concatenate(
                (data_array[:, :self.__predicted_feature__], data_array[:, self.__predicted_feature__ + 1:]), axis=1)
            for fa in features_array:
                features.append(list(fa))
            return list(features)
        except Exception as e:
            Logger.CmdLogger(e.__str__())
            raise e

    # Label prediction after the training
    def Predict(self, test_features: List[List[float]]):
        try:
            return list(self.__rf__.predict(X=test_features))
        except Exception as e:
            Logger.CmdLogger(e.__str__())
            raise e

    # Save models trained for each label to reduce to neglect another training if a framework restart is necessary
    def SaveModel(self, model):
        try:
            path = os.path.join(self.__model_recover_directory__ + '/' + self.__model_recover_filename__)
            joblib.dump(model, open(path, 'wb'))
            Logger.CmdLogger(self.__model_recover_filename__ + ' saved!')
        except Exception as e:
            print(e)
            raise e

    # In case of a restart, load the models saved
    def LoadModel(self, filename):
        try:
            model = joblib.load(filename)
            return model
        except Exception as e:
            Logger.CmdLogger(e.__str__())
            raise e

    # Publish the test result on the database
    def Publish_Test_Result(self, test_result: dict):
        try:
            result = self.__test_result_collection__.insert_one(test_result)
            return result
        except Exception as e:
            Logger.CmdLogger(e.__str__())
            raise e

    # Training function for each predictor
    def Trainer(self, trainset: List[List[float]]):
        try:
            #Model of predictor do not exist and a training is required
            trainer = threading.Thread(target=self.Train, args=[trainset])
            trainer.setName('PredictorTrainer_' + str(self.__predicted_feature__))
            Logger.CmdLogger(log=str('Start training on predictor ' + str(self.__predicted_feature__)))
            trainer.start()
            return trainer
        except Exception as e:
            Logger.CmdLogger(e.__str__())
            raise e

    # Recovering function for each predictor created
    def Recoverer(self):
        try:
            models = fnmatch.filter(os.listdir(self.__model_recover_directory__), self.__model_recover_filename__)
            #Model of predictor is saved and there is not training required
            if len(models) > 0:
                recoverer = threading.Thread(target=self.Recover, args=[models[0]])
                recoverer.setName('PredictorRecoverer_' + str(self.__predicted_feature__))
                Logger.CmdLogger('Start recovery on predictor ' + str(self.__predicted_feature__))
                recoverer.start()
                return recoverer
        except Exception as e:
            Logger.CmdLogger(e.__str__())
            raise e

    # Recover function 
    def Recover(self, model):
        self.__rf__ = self.LoadModel(self.__model_recover_directory__ + '/' + model)
        self.__trained__ = True
        Logger.CmdLogger('Predictor ' + str(self.__predicted_feature__) + ' recovered')

    # Train function
    def Train(self, trainset: List[List[float]]):
        try:
            train_labels = self.SelectLabel(dataset=trainset)
            train_features = self.SelectFeatures(dataset=trainset)
            tstart = datetime.now()
            self.__rf__.fit(X=train_features, y=train_labels)
            Logger.CmdLogger('Train for Predictor ' + str(self.__predicted_feature__) + ' completed in ' + str(
                (datetime.now() - tstart).seconds) + 'sec')
            self.SaveModel(self.__rf__)
            self.__trained__ = True
        except Exception as e:
            Logger.CmdLogger(e.__str__())
            raise e

    # Testing function for each predictor
    def Tester(self, testset: List[List[float]], last_testset_time: datetime):
        try:
            tester = threading.Thread(target=self.Test, args=[testset, last_testset_time])
            tester.setName('PredictorTester_' + str(self.__predicted_feature__))
            Logger.CmdLogger('Start test on predictor ' + str(self.__predicted_feature__))
            tester.start()
            return tester
        except Exception as e:
            Logger.CmdLogger(e.__str__())
            raise e

    # Test function
    def Test(self, testset: List[List[float]], last_testset_time: datetime):
        try:
            test_labels = self.SelectLabel(dataset=testset)
            test_features = self.SelectFeatures(dataset=testset)
            predictions = self.Predict(test_features=test_features)
            test_result = self.Compute_Test_Result(predictions=predictions, labels=test_labels,
                                                   last_testset_time=last_testset_time)
            result = self.Publish_Test_Result(test_result=test_result)
        except Exception as e:
            Logger.CmdLogger(e.__str__())
            raise e

    # Scores of the prediction
    @staticmethod
    def Scores(predictions: List[float], labels: List[float]):
        from sklearn.metrics import d2_pinball_score
        from sklearn.metrics import d2_tweedie_score
        from sklearn.metrics import r2_score
        from sklearn.metrics import d2_absolute_error_score
        try:
            r2_score = r2_score(y_true=labels, y_pred=predictions, force_finite=True)
            d2_absolute_score = d2_absolute_error_score(y_true=labels, y_pred=predictions)
            d2_pinball_score = d2_pinball_score(y_true=labels, y_pred=predictions)
            d2_tweedie_score = d2_tweedie_score(y_true=labels, y_pred=predictions)
            scores = {'R2': r2_score, 'D2A': d2_absolute_score, 'D2P': d2_pinball_score, 'D2T': d2_tweedie_score}
            score_result = {'Scores': dict(scores)}
            return score_result
        except Exception as e:
            Logger.CmdLogger(e.__str__())
            raise e

    # Errors of the prediction
    @staticmethod
    def Errors(predictions: List[float], labels: List[float]):
        from sklearn.metrics import mean_squared_error
        from sklearn.metrics import mean_absolute_error

        try:
            s_error = sum(pow(np.array(predictions) - np.array(labels), 2))
            ms_error = mean_squared_error(y_true=labels, y_pred=predictions, squared=True)
            rms_error = mean_squared_error(y_true=labels, y_pred=predictions, squared=False)
            ma_error = mean_absolute_error(y_true=labels, y_pred=predictions)
            errors = {'SE': float(s_error), 'MSE': float(ms_error), 'RMSE': float(rms_error), 'MAE': float(ma_error)}
            error_result = {'Errors': dict(errors)}
            return error_result
        except Exception as e:
            Logger.CmdLogger(e.__str__())
            raise e

    # Compute test result for each predictor
    def Compute_Test_Result(self, predictions: List[float], labels: List[float], last_testset_time: datetime):
        test_result = {}
        import concurrent.futures
        try:
            with concurrent.futures.ThreadPoolExecutor(max_workers=2) as executor:
                futures = []
                try:
                    futures.append(executor.submit(Predictor.Errors, predictions, labels))
                    futures.append(executor.submit(Predictor.Scores, predictions, labels))
                except Exception as e:
                    Logger.CmdLogger(e.__str__())
                    raise e

                for future in futures:
                    try:
                        result = future.result(timeout=1)
                        if future.done() and not future.cancelled() and not future.running():
                            test_result = dict(test_result, **result)
                    except Exception as e:
                        Logger.CmdLogger(e.__str__())
                        raise e
        except Exception as e:
            Logger.CmdLogger(e.__str__())
            raise e

        test_result['Timestamp'] = datetime.fromtimestamp(last_testset_time)
        test_result['TimestampUnix'] = datetime.timestamp(test_result['Timestamp'])
        test_result['Predicted_Feature'] = int(self.__predicted_feature__)
        return test_result