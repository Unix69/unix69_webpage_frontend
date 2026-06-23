/*# +---------------------------------------------------------+
# |   -=*=-  THIS FILE IS NOT INTENDED FOR SHARING  -=*=-   |
# +---------------------------------------------------------+
# The intellectual and technical concepts are proprietary.
# Dissemination or reproduction is forbidden and may result
# in civil charges and criminal penalties.
*/

#include <stdlib.h>
#include <fstream>
#include <iostream>

#include "../../../include/Agent/ErrorDegradationTimeEstimatorAgent/TcErrorDegradationTimeEstimator.h"
#include "../../../include/TcLinearRegressor.h"
#include <fstream>
#include <sstream>
#include <string>
#include <algorithm>    // For std::remove()

TcErrorDegradationTimeEstimator::TcErrorDegradationTimeEstimator(bool pLocalFileConfigEnable, bool pLocalConfigEnable, string pLocalConfigFile, string pDatabaseName, string pConfigurationCollection, string pMongoDriverRemoteConnectionType, string pMongoDriverRemoteConnectionHost, uint16_t pMongoDriverRemoteConnectionPort, string pAgentID, int pNumSamplesRead, unsigned int pPredictor, string pPredictedErrorType, double pPredictedErrorValue, double pMinOperativeThresholdError, double pMaxOperativeThresholdError, int pMinNumOfRegrSamples, chrono::microseconds pPreventionThresholdTime, string pTestResultCollection, string pPredictionResultCollection, string pAgentname, chrono::microseconds pStepRunTime, chrono::time_point<chrono::high_resolution_clock> pNextRunTime, TcAgent::Priority pPriority, bool pStopped)
{
	int rResult = 0;

	if (pLocalConfigEnable)
	{
		TcAgent(pDatabaseName, pMongoDriverRemoteConnectionType, pMongoDriverRemoteConnectionHost, pMongoDriverRemoteConnectionPort, pAgentID, pAgentname, pStepRunTime, pNextRunTime, pPriority, pStopped);
		this->rmNumSamplesRead = pNumSamplesRead;
		this->rmPredictor = pPredictor;
		this->rmPredictedErrorType = pPredictedErrorType;
		this->rmPredictedErrorValue = pPredictedErrorValue;
		this->rmMinOperativeThresholdError = pMinOperativeThresholdError;
		this->rmMaxOperativeThresholdError = pMaxOperativeThresholdError;
		this->rmMinNumOfRegrSamples = pMinNumOfRegrSamples;
		this->rmNotificationPreventionThresholdTime = pPreventionThresholdTime;
		this->rmLastSampleTime = chrono::time_point<chrono::system_clock, chrono::microseconds>(chrono::microseconds(0));
		this->rmLastPredictedTimeToError = chrono::microseconds(0);
		this->rmLastPredictedTimeToErrorTime = chrono::system_clock::now();
		this->rmTestResultCollection = pTestResultCollection;
		this->rmPredictionResultCollection = pPredictionResultCollection;
		this->rmConfigurationCollection = pConfigurationCollection;
		this->rmConfigurationFile = pLocalConfigFile;
		this->rmLocalConfigEnable = pLocalConfigEnable;
		this->rmLocalFileConfigEnable = pLocalFileConfigEnable;
	} else {
		this->rmDatabaseName = pDatabaseName;
		this->rmLocalConfigEnable = pLocalConfigEnable;
		this->rmLocalFileConfigEnable = pLocalFileConfigEnable;
		this->rmConfigurationFile = pLocalConfigFile;
		this->rmAgentID = pAgentID;
		this->rmConfigurationCollection = pConfigurationCollection;
		// Get Last Agent Configuration
		if ((rResult = this->fGetConfiguration()) < 0)
		{
			fprintf(stdout, ANSI_COLOR_RED "(%s) Get configuration data fails with error %d" ANSI_COLOR_RESET "\n", __func__, rResult);
			fflush(stdout);
		}
	}

	if ((rResult = this->cmMongoInterface->fDatabaseExist(pDatabaseName)) < 0) {
		fprintf(stdout, ANSI_COLOR_RED "(%s) Database exist fails with error %d" ANSI_COLOR_RESET "\n", __func__, rResult);
		fflush(stdout);
		fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
		fflush(stdout);
		fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
		fflush(stdout);
	}
	
	if ((rResult = this->cmMongoInterface->fCollectionExist(pDatabaseName, pConfigurationCollection)) < 0) {
		fprintf(stdout, ANSI_COLOR_RED "(%s) Collection exist fails with error %d" ANSI_COLOR_RESET "\n", __func__, rResult);
		fflush(stdout);
		fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
		fflush(stdout);
	}

	if ((rResult = this->cmMongoInterface->fCollectionExist(pDatabaseName, pTestResultCollection)) < 0) {
		fprintf(stdout, ANSI_COLOR_RED "(%s) Collection exist fails with error %d" ANSI_COLOR_RESET "\n", __func__, rResult);
		fflush(stdout);
		fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
		fflush(stdout);
	}
	
}

TcErrorDegradationTimeEstimator::~TcErrorDegradationTimeEstimator() { ; }


int TcErrorDegradationTimeEstimator::fGetConfiguration(){
	if (!this->rmLocalConfigEnable && this->rmLocalFileConfigEnable)
		{
			// Get Last Agent Configuration
			int rResult = 0;
			if ((rResult = this->fGetLastConfigurationFromFile()) < 0)
			{
				fprintf(stdout, ANSI_COLOR_RED "(%s) Get configuration data from file fails with error %d" ANSI_COLOR_RESET "\n", __func__, rResult);
				fflush(stdout);
				return(TcErrorDegradationTimeEstimator::TcError::TcGetConfigurationErrors::kFail);
			}
		} else if(!this->rmLocalConfigEnable && !this->rmLocalFileConfigEnable) {
			// Get Last Agent Configuration
			int rResult = 0;
			if ((rResult = this->fGetLastConfigurationFromDatabase()) < 0)
			{
				fprintf(stdout, ANSI_COLOR_RED "(%s) Get configuration data from database fails with error %d" ANSI_COLOR_RESET "\n", __func__, rResult);
				fflush(stdout);
				return(TcErrorDegradationTimeEstimator::TcError::TcGetConfigurationErrors::kFail);
			}
		}
		return(TcErrorDegradationTimeEstimator::TcError::TcGetConfigurationErrors::kSuccess);
}


int TcErrorDegradationTimeEstimator::fRun()
{
	try
	{
		int rResult = 0;
		int rPredStatus = 0;
		list<long long> rTimes;
		list<double> rErrors;
		long long rPrediction = 0;

		double rMcoefficient = 0;
		double rQoffset = 0;
		chrono::system_clock::time_point cStartTrainTime;
		chrono::system_clock::time_point cEndTrainTime;
		chrono::system_clock::time_point rEndPredictionTime;
		chrono::system_clock::time_point rPredictedTimeOfError;
		chrono::microseconds cPredictedTimeToError;

		chrono::system_clock::time_point cAgentStartTime = chrono::system_clock::now();

		fprintf(stdout, "(%s) Enter in %s \n", __func__, __func__);
		fflush(stdout);

		fprintf(stdout, "(%s) Get Agent Configuration\n", __func__);
		fflush(stdout);

		//Get Configuration for this Agent
		if ((rResult = this->fGetConfiguration()) < 0)
		{
			fprintf(stdout, ANSI_COLOR_RED "(%s) Get configuration data fails with error %d" ANSI_COLOR_RESET "\n", __func__, rResult);
			fflush(stdout);
		}

		fprintf(stdout, "(%s) Get Last Errors\n", __func__);
		fflush(stdout);

		// Get Last Errors to evaluate
		rResult = this->fGetLastErrors(&rTimes, &rErrors);
		if (rResult < 0)
		{
			fprintf(stdout, ANSI_COLOR_RED "(%s) Get data from database fails with error %d" ANSI_COLOR_RESET "\n", __func__, rResult);
			fflush(stdout);
			fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
			fflush(stdout);
			return (kRunFails);
		}

		fprintf(stdout, "(%s) Verify samples read\n", __func__);
		fflush(stdout);

		if (rTimes.size() <= 0 || rTimes.size() > 0 && rTimes.front() * 10000 <= this->rmLastSampleTime.time_since_epoch().count())
		{
			fprintf(stdout, ANSI_COLOR_YELLOW "(%s) No data from database available" ANSI_COLOR_RESET "\n", __func__);
			fflush(stdout);
			fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
			fflush(stdout);
			return (kRunFails);
		}

		fprintf(stdout, "(%s) Update last sample read\n", __func__);
		fflush(stdout);

		this->rmLastSampleTime = chrono::time_point<chrono::system_clock, chrono::microseconds>(chrono::microseconds(rTimes.front()));

		// Last Error Sample Value lower than a Minimum Error Threshold
		if (rErrors.size() > 0 && rErrors.front() < this->rmMinOperativeThresholdError)
		{
			fprintf(stdout, ANSI_COLOR_GREEN "(%s) Last Error is lower than Minimum Error Operative Threshold, prediction will be skipped" ANSI_COLOR_RESET "\n", __func__);
			fflush(stdout);
		} // Last Error Sample Value is higher than a Maximum Error Threshold
		else if (rErrors.size() > 0 && rErrors.front() > this->rmMaxOperativeThresholdError)
		{
			fprintf(stdout, ANSI_COLOR_RED "(%s) Last Error is higher than Maximum Error Operative Threshold, prediction will be skipped" ANSI_COLOR_RESET "\n", __func__);
			fflush(stdout);
		}
		else
		{
			// Time and Samples data have not the same size (no linreg is possible) or are both null
			if (rTimes.size() != rErrors.size() || (!rTimes.size() && !rErrors.size()))
			{
				fprintf(stdout, ANSI_COLOR_RED "(%s) Times and Samples Data invalid sizes, prediction will be skipped" ANSI_COLOR_RESET "\n", __func__);
				fflush(stdout);
				fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
				fflush(stdout);
				return (kRunFails);
			}
			// too few data to making accurate predictions
			if ((rErrors.size() < (size_t)this->rmMinNumOfRegrSamples))
			{
				fprintf(stdout, ANSI_COLOR_YELLOW "(%s) Samples Data invalid sized, prediction will be skipped" ANSI_COLOR_RESET "\n", __func__);
				fflush(stdout);
			}
			else
			{
				fprintf(stdout, ANSI_COLOR_YELLOW "(%s) Time to Error Prediction\n" ANSI_COLOR_RESET, __func__);
				fflush(stdout);

				this->fMakePrediction(rTimes, rErrors, &rPrediction, &rMcoefficient, &rQoffset, &cStartTrainTime, &cEndTrainTime, &rEndPredictionTime, &rPredictedTimeOfError, &cPredictedTimeToError);
				if ((rResult = this->fNotifyPrediction(cAgentStartTime, rTimes.front(), rErrors.front(), rPrediction, rMcoefficient, rQoffset, cStartTrainTime, cEndTrainTime, rEndPredictionTime, rPredictedTimeOfError, cPredictedTimeToError)) < 0)
				{
					fprintf(stdout, ANSI_COLOR_RED "(%s) Notify prediction fails with error %d" ANSI_COLOR_RESET "\n", __func__, rResult);
					fflush(stdout);
					fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
					fflush(stdout);
					return (kRunFails);
				}

				// Time to Error is over prevention thresholds, notification is needed
				if (cPredictedTimeToError > this->rmNotificationPreventionThresholdTime)
				{
					fprintf(stdout, ANSI_COLOR_RED "(%s) Notification for maintainers" ANSI_COLOR_RESET "\n", __func__);
					fflush(stdout);
				}
			}
		}

		fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
		fflush(stdout);

		return (kRunSuccess);
	} catch (exception e) {
		fprintf(stdout, "Catched exception - Message %s\n", e.what());
		fflush(stdout);
		fprintf(stdout, "Exit from Agents\n");
		fflush(stdout);
		fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
		fflush(stdout);
		return (kRunFails);
	}
}

int TcErrorDegradationTimeEstimator::fGetLastErrors(list<long long> *pTimes, list<double> *pErrors)
{

	list<long long> rTimes;
	list<double> rErrors;
	auto start = chrono::high_resolution_clock::now();
	fprintf(stdout, "(%s) Enter in %s \n", __func__, __func__);
	fflush(stdout);

	int rResult = 0;

	if ((rResult = this->cmMongoInterface->fGetLastErrors(&rErrors, &rTimes, this->rmPredictedErrorType, this->rmDatabaseName, this->rmTestResultCollection, TcErrorDegradationTimeEstimator::kPredictorAttribute, to_string(this->rmPredictor), TcErrorDegradationTimeEstimator::kLastTestTimeAttribute, this->rmNumSamplesRead, 0, "", list<string>({TcErrorDegradationTimeEstimator::kErrorsAttribute, TcErrorDegradationTimeEstimator::kLastTestTimeAttribute}))) < 0)
	{
		fprintf(stdout, ANSI_COLOR_RED "(%s) Get data from database fails with error %d" ANSI_COLOR_RESET "\n", __func__, rResult);
		fflush(stdout);
		return (kGetDataFails);
	}

	*pErrors = rErrors;
	*pTimes = rTimes;

	fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
	fflush(stdout);

	return (kGetDataSuccess);
}

int TcErrorDegradationTimeEstimator::fGetLastConfigurationFromDatabase()
{

	fprintf(stdout, "(%s) Enter in %s \n", __func__, __func__);
	fflush(stdout);

	int rResult = 0;
	int rAgentPriority = 0;
	if ((rResult = this->cmMongoInterface->fGetLastConfiguration(this->rmDatabaseName, this->rmConfigurationCollection, TcErrorDegradationTimeEstimator::kConfTimestamp, this->rmAgentID,
																 &(this->rmNumSamplesRead), &(this->rmPredictor), &(this->rmPredictedErrorType), &(this->rmPredictedErrorValue),
																 &(this->rmMinOperativeThresholdError), &(this->rmMaxOperativeThresholdError), &(this->rmMinNumOfRegrSamples),
																 &(this->rmNotificationPreventionThresholdTime), &(this->rmTestResultCollection), &(this->rmPredictionResultCollection),
																 &(this->rmConfigurationCollection), &(this->rmDatabaseName), &(this->rmMongoDriverRemoteConnectionType), &(this->rmMongoDriverRemoteConnectionHost),
																 &(this->rmMongoDriverRemoteConnectionPort), &(this->rmAgentID), &(this->rmAgentName),
																 &(this->cmStepRunTime), &(this->cmNextRunTime), &(rAgentPriority), &(this->cmStopped)) < 0))
	{
		fprintf(stdout, ANSI_COLOR_RED "(%s) Get data from database fails with error %d" ANSI_COLOR_RESET "\n", __func__, rResult);
		fflush(stdout);
		return (kGetDataFails);
	}

	this->cmRunPriority = IAgent::Priority(rAgentPriority);
	this->cmMongoInterface = new IMongoDriverAgentInterface("Agent DB Application Interface", this->rmMongoDriverRemoteConnectionType, this->rmMongoDriverRemoteConnectionHost, this->rmMongoDriverRemoteConnectionPort);

	fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
	fflush(stdout);

	return (kGetDataSuccess);
}

int TcErrorDegradationTimeEstimator::fGetLastConfigurationFromFile()
{

	fprintf(stdout, "(%s) Enter in %s \n", __func__, __func__);
	fflush(stdout);

	string rConfiguration_file = this->rmConfigurationFile;

	int rResult = 0;
	ifstream cConfiguration_file_is(rConfiguration_file);
	
	if (!cConfiguration_file_is.is_open()){
		fprintf(stdout, ANSI_COLOR_RED "(%s) Cannot open file %s" ANSI_COLOR_RESET "\n", __func__, rConfiguration_file.c_str());
		fflush(stdout);
		return (IMongoDriverAgentInterface::kGetConfigurationFails);
	}

	string rConfiguration;
	string rJsonString((std::istreambuf_iterator<char>(cConfiguration_file_is)),
                 std::istreambuf_iterator<char>());

	if (rJsonString.empty()){
		fprintf(stdout, ANSI_COLOR_RED "(%s) Configuration string is empty" ANSI_COLOR_RESET "\n", __func__);
		fflush(stdout);
		return (IMongoDriverAgentInterface::kGetConfigurationFails);
	}
	
	rJsonString.erase(remove(rJsonString.begin(), rJsonString.end(), '\t'), rJsonString.end());
	rJsonString.erase(remove(rJsonString.begin(), rJsonString.end(), '\n'), rJsonString.end());	
	bsoncxx::document::value cConfiguration = bsoncxx::from_json(rJsonString);
	this->rmTestResultCollection = string(cConfiguration.view()[TcErrorDegradationTimeEstimator::kTestResultCollection].get_utf8().value.to_string());
	this->rmConfigurationCollection = string(cConfiguration.view()[TcErrorDegradationTimeEstimator::kConfigurationCollection].get_utf8().value.to_string());

	
	auto cAgentConfiguration = cConfiguration.view()[TcErrorDegradationTimeEstimator::kConfigurationAgents][this->rmAgentID];

	if (cAgentConfiguration)
	{
		this->rmNumSamplesRead = cAgentConfiguration[TcErrorDegradationTimeEstimator::kNumSamplesRead].get_int32().value;
		this->rmPredictor = (unsigned int)cAgentConfiguration[TcErrorDegradationTimeEstimator::kAgentPredictor].get_int32().value;
		this->rmPredictedErrorType = string(cAgentConfiguration[TcErrorDegradationTimeEstimator::kPredictedErrorType].get_utf8().value.to_string());
		this->rmMinOperativeThresholdError = (double)cAgentConfiguration[TcErrorDegradationTimeEstimator::kMinOpeThresholdError].get_double().value;
		this->rmMaxOperativeThresholdError = (double)cAgentConfiguration[TcErrorDegradationTimeEstimator::kMaxOpeThresholdError].get_double().value;
		this->rmMinNumOfRegrSamples = (double) cAgentConfiguration[TcErrorDegradationTimeEstimator::kkMinNumRegrSamples].get_int32().value;
		this->rmPredictedErrorValue = cAgentConfiguration[TcErrorDegradationTimeEstimator::kPredictedErrorValue].get_double().value;
		this->rmNotificationPreventionThresholdTime = chrono::microseconds(cAgentConfiguration[TcErrorDegradationTimeEstimator::kPreventionThresholdTime].get_int32().value);
		this->rmPredictionResultCollection = string(cAgentConfiguration[TcErrorDegradationTimeEstimator::kPredictionResultCollection].get_utf8().value.to_string());
		this->rmDatabaseName = string(cAgentConfiguration[TcErrorDegradationTimeEstimator::kDatabaseName].get_utf8().value.to_string());
		this->rmMongoDriverRemoteConnectionType = string(cAgentConfiguration[TcErrorDegradationTimeEstimator::kMongoDriverRemoteConnectionType].get_utf8().value.to_string());
		this->rmMongoDriverRemoteConnectionHost = string(cAgentConfiguration[TcErrorDegradationTimeEstimator::kMongoDriverRemoteConnectionHost].get_utf8().value.to_string());
		this->rmMongoDriverRemoteConnectionPort = cAgentConfiguration[TcErrorDegradationTimeEstimator::kMongoDriverRemoteConnectionPort].get_int32().value;
		this->rmAgentID = string(cAgentConfiguration[TcErrorDegradationTimeEstimator::kAgentId].get_utf8().value.to_string());
		this->rmAgentName = string(cAgentConfiguration[TcErrorDegradationTimeEstimator::kAgentName].get_utf8().value.to_string());
		this->cmStepRunTime = chrono::microseconds((int) cAgentConfiguration[TcErrorDegradationTimeEstimator::kStepRunTime].get_int32().value);
		this->cmNextRunTime = chrono::high_resolution_clock::now();
		this->cmRunPriority = IAgent::Priority(cAgentConfiguration[TcErrorDegradationTimeEstimator::kPriority].get_int32().value);
		this->cmStopped.store(cAgentConfiguration[TcErrorDegradationTimeEstimator::kStopped].get_bool().value);
		this->cmMongoInterface = new IMongoDriverAgentInterface("Agent DB Application Interface", this->rmMongoDriverRemoteConnectionType, this->rmMongoDriverRemoteConnectionHost, this->rmMongoDriverRemoteConnectionPort);
	}
	else
	{
		fprintf(stdout, ANSI_COLOR_RED "(%s) Agent configuration invalid - Agent %s" ANSI_COLOR_RESET "\n", __func__, this->rmAgentID.c_str());
		fflush(stdout);
		return (IMongoDriverAgentInterface::kGetConfigurationFails);
	}

	fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
	fflush(stdout);

	return (kGetDataSuccess);
}

void TcErrorDegradationTimeEstimator::fMakePrediction(list<long long> pTimes, list<double> pErrors, long long *pPrediction, double *pMcoefficient, double *pQoffset, chrono::system_clock::time_point *pStartTrainTime, chrono::system_clock::time_point *pEndTrainTime, chrono::system_clock::time_point *pEndPredictionTime, chrono::system_clock::time_point *pPredictedTimeOfError, chrono::microseconds *pPredictedTimeToError)
{
	TcLinearRegressor<double, long long> lr;
	double rError = this->rmPredictedErrorValue;
	long long rPrediction = 0;

	fprintf(stdout, ANSI_COLOR_YELLOW "(%s) Prediction" ANSI_COLOR_RESET "\n", __func__);
	fflush(stdout);

	chrono::system_clock::time_point cStartTrainTime = chrono::system_clock::now();
	lr.fTrain(vector<double>(begin(pErrors), end(pErrors)), vector<long long>(begin(pTimes), end(pTimes)));
	chrono::system_clock::time_point cEndTrainTime = chrono::system_clock::now();
	lr.fPredict(rError, &rPrediction);

	chrono::system_clock::time_point cPredictedTimeOfError = chrono::time_point<chrono::system_clock, chrono::microseconds>(chrono::microseconds(rPrediction));
	chrono::microseconds cPredictedTimeToError = chrono::duration_cast<chrono::hours>(cPredictedTimeOfError - chrono::system_clock::now());
	chrono::system_clock::time_point cEndPredictTime = chrono::system_clock::now();

	*pPrediction = rPrediction;
	*pStartTrainTime = cStartTrainTime;
	*pEndTrainTime = cEndTrainTime;
	*pEndPredictionTime = cEndPredictTime;
	*pPredictedTimeToError = cPredictedTimeToError;
	*pPredictedTimeOfError = cPredictedTimeOfError;
	*pMcoefficient = lr.fGetM();
	*pQoffset = lr.fGetQ();

	return;
}

int TcErrorDegradationTimeEstimator::fNotifyPrediction(chrono::system_clock::time_point pAgentStartTime, long long pLastErrorTime, double pLastError, long long pPrediction, double pMcoefficient, double pQoffset, chrono::system_clock::time_point pStartTrainTime, chrono::system_clock::time_point pEndTrainTime, chrono::system_clock::time_point pEndPredictionTime, chrono::system_clock::time_point pPredictedTimeOfError, chrono::microseconds pPredictedTimeToError)
{

	fprintf(stdout, "(%s) Enter in %s \n", __func__, __func__);
	fflush(stdout);

	int rResult = 0;

	if ((rResult = this->cmMongoInterface->fInsertPrediction(this->rmDatabaseName, this->rmPredictionResultCollection, pAgentStartTime, pLastErrorTime, pLastError, pPrediction, pMcoefficient, pQoffset, pStartTrainTime, pEndTrainTime, pEndPredictionTime, pPredictedTimeOfError, pPredictedTimeToError, this->rmPredictor)) < 0)
	{
		fprintf(stdout, ANSI_COLOR_RED "(%s) Get data from database fails with error %d" ANSI_COLOR_RESET "\n", __func__, rResult);
		fflush(stdout);
		return (TcError::TcNotifyPrediction::kSuccess);
	}

	fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
	fflush(stdout);

	return (0);
}

const string TcErrorDegradationTimeEstimator::kPredictorAttribute = "Predicted_Feature";
const string TcErrorDegradationTimeEstimator::kErrorsAttribute = "Errors";
const string TcErrorDegradationTimeEstimator::kLastTestTimeAttribute = "Timestamp";
const string TcErrorDegradationTimeEstimator::kActualErrorTime = "ActualErrorTime";
const string TcErrorDegradationTimeEstimator::kAgentStartTime = "AgentStartTime";
const string TcErrorDegradationTimeEstimator::kTrainStartTime = "TrainStartTime";
const string TcErrorDegradationTimeEstimator::kTrainEndTime = "TrainEndTime";
const string TcErrorDegradationTimeEstimator::kPredictEndTime = "PredictEndTime";
const string TcErrorDegradationTimeEstimator::kAgentEndTime = "AgentEndTime";
const string TcErrorDegradationTimeEstimator::kEstimDegradTime = "EstimDegradTime";
const string TcErrorDegradationTimeEstimator::kRemainingTime = "RemainingTime";
const string TcErrorDegradationTimeEstimator::kPredictor = "Predictor";
const string TcErrorDegradationTimeEstimator::kActualError = "ActualError";
const string TcErrorDegradationTimeEstimator::kM = "M";
const string TcErrorDegradationTimeEstimator::kQ = "Q";
const string TcErrorDegradationTimeEstimator::kNumSamplesRead = "num_samples_read";
const string TcErrorDegradationTimeEstimator::kPredictedErrorType = "predicted_error_type";
const string TcErrorDegradationTimeEstimator::kPredictedErrorValue = "predicted_error_value";
const string TcErrorDegradationTimeEstimator::kMinOpeThresholdError = "min_operative_threshold_error";
const string TcErrorDegradationTimeEstimator::kMaxOpeThresholdError = "max_operative_threshold_error";
const string TcErrorDegradationTimeEstimator::kkMinNumRegrSamples = "min_num_of_regr_samples";
const string TcErrorDegradationTimeEstimator::kPreventionThresholdTime = "prevention_threshold_time";
const string TcErrorDegradationTimeEstimator::kTestResultCollection = "testresult_collection";
const string TcErrorDegradationTimeEstimator::kPredictionResultCollection = "prediction_result_collection";
const string TcErrorDegradationTimeEstimator::kConfigurationCollection = "configuration_collection";
const string TcErrorDegradationTimeEstimator::kDatabaseName = "database_name";
const string TcErrorDegradationTimeEstimator::kMongoDriverRemoteConnectionType = "mongo_driver_remote_connection_type";
const string TcErrorDegradationTimeEstimator::kMongoDriverRemoteConnectionHost = "mongodriver_remote_connection_host";
const string TcErrorDegradationTimeEstimator::kMongoDriverRemoteConnectionPort = "mongo_driver_remote_connection_port";
const string TcErrorDegradationTimeEstimator::kAgentId = "agent_id";
const string TcErrorDegradationTimeEstimator::kAgentPredictor = "predictor";
const string TcErrorDegradationTimeEstimator::kAgentName = "agent_name";
const string TcErrorDegradationTimeEstimator::kStepRunTime = "step_run_time";
const string TcErrorDegradationTimeEstimator::kNextRunTime = "next_run_time";
const string TcErrorDegradationTimeEstimator::kPriority = "priority";
const string TcErrorDegradationTimeEstimator::kStopped = "stopped";
const string TcErrorDegradationTimeEstimator::kConfigurationAgents = "agents";
const string TcErrorDegradationTimeEstimator::kConfTimestamp = "timestamp";
const string TcErrorDegradationTimeEstimator::kNumOfAgents = "NumOfAgents";
const string TcErrorDegradationTimeEstimator::kDefaultDatabase = "InfoDB";
const bool TcErrorDegradationTimeEstimator::kDefaultLocalConfigurationEnable = false;
const bool TcErrorDegradationTimeEstimator::kDefaultConfigurationFileEnable = true;
const string TcErrorDegradationTimeEstimator::kDefaultDatabaseConnectionType = "mongodb";
const string TcErrorDegradationTimeEstimator::kDefaultDatabaseConnectionHost = "127.0.0.1";
const uint16_t TcErrorDegradationTimeEstimator::kDefaultDatabaseConnectionPort = (uint16_t) 27017;
const string TcErrorDegradationTimeEstimator::kDefaultConfigurationCollection = "Configuration";
const string TcErrorDegradationTimeEstimator::kDefaultTestResultCollection = "TestResult";
const string TcErrorDegradationTimeEstimator::kDefaultPredictionResultCollection = "Prediction";
const string TcErrorDegradationTimeEstimator::kDefaultConfigurationSortingAttribute = "timestamp";
const string TcErrorDegradationTimeEstimator::kDefaultConfigurationFile = "../../Configuration.json";
const string TcErrorDegradationTimeEstimator::kAgentsConfigurationsKey = "agents";
const string TcErrorDegradationTimeEstimator::kDefaultAgentId = "AG0";
const string TcErrorDegradationTimeEstimator::kDefaultAgentName = "Agent 0";
const uint64_t TcErrorDegradationTimeEstimator::kDefaultStepRunTime = (uint64_t) 1000;
const uint64_t TcErrorDegradationTimeEstimator::kDefaultPreventionThresholdTime = (uint64_t) 5000;
const int TcErrorDegradationTimeEstimator::kDefaultNumSamplesRead = 10;
const unsigned int TcErrorDegradationTimeEstimator::kDefaultPredictor = 0;
const string TcErrorDegradationTimeEstimator::kDefaultPredictedErrorType = "MSE";
const double TcErrorDegradationTimeEstimator::kDefaultPredictedErrorValue = 100;
const double TcErrorDegradationTimeEstimator::kDefaultMinOperativeThresholdError = 10;
const double TcErrorDegradationTimeEstimator::kDefaultMaxOperativeThresholdError = 80;
const int TcErrorDegradationTimeEstimator::kDefaultMinNumOfRegrSamples = 10;
