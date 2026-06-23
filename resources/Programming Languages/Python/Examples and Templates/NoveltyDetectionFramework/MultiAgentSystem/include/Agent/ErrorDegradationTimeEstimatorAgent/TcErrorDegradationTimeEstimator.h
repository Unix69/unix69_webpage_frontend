/*# +---------------------------------------------------------+
# |   -=*=-  THIS FILE IS NOT INTENDED FOR SHARING  -=*=-   |
# +---------------------------------------------------------+
# The intellectual and technical concepts are proprietary.
# Dissemination or reproduction is forbidden and may result
# in civil charges and criminal penalties.
*/

#ifndef TCERRORDEGRADATIONTIMEESTRIMATOR_H
#define TCERRORDEGRADATIONTIMEESTRIMATOR_H

#include <string>
#include <chrono>
#include <vector>

#include "../TcAgent.h"

using namespace std;

class TcErrorDegradationTimeEstimator : public TcAgent
{

private:

	bool rmDBConfigEnable;
	int rmNumSamplesRead;
	double rmMinOperativeThresholdError;
	double rmMaxOperativeThresholdError;
	int rmMinNumOfRegrSamples;

	unsigned int rmPredictor;
	string rmPredictedErrorType;
	double rmPredictedErrorValue;

	chrono::microseconds rmNotificationPreventionThresholdTime;
	chrono::microseconds rmLastPredictedTimeToError;
	chrono::system_clock::time_point rmLastPredictedTimeToErrorTime;
	chrono::system_clock::time_point rmLastSampleTime;

	string rmTestResultCollection;
	string rmPredictionResultCollection;
	string rmConfigurationCollection;
	string rmConfigurationFile;
	bool rmLocalFileConfigEnable;
	bool rmLocalConfigEnable;




public:

	class TcError{
			public:
				class TcGetConfigurationErrors {
        			public:
            			static const int kSuccess = 0;
						static const int kNoDataAvailable = 1;
						static const int kFail = -1;
						static const int kConnectionLost = -2;
        		};
				class TcGetLastErrors {
        			public:
            			static const int kSuccess = 0;
						static const int kNoDataAvailable = 1;
						static const int kFail = -1;
						static const int kConnectionLost = -2;
        		};
				class TcNotifyPrediction {
        			public:
            			static const int kSuccess = 0;
						static const int kFail = -1;
						static const int kConnectionLost = -2;
        		};
				class TcMakePrediction {
        			public:
            			static const int kSuccess = 0;
						static const int kInsufficientSamples = 1;
						static const int kFail = -1;
        		};
			};

	static const string kPredictorAttribute;
	static const string kLastTestTimeAttribute;
	static const string kErrorsAttribute;

	static const string kActualErrorTime;
	static const string kAgentStartTime;
	static const string kTrainStartTime;
	static const string kTrainEndTime;
	static const string kPredictEndTime;
	static const string kAgentEndTime;
	static const string kEstimDegradTime;
	static const string kRemainingTime;
	static const string kPredictor;
	static const string kActualError;
	static const string kM;
	static const string kQ;

	static const string kNumSamplesRead;
	static const string kPredictedErrorType;
	static const string kPredictedErrorValue;
	static const string kMinOpeThresholdError;
	static const string kMaxOpeThresholdError;
	static const string kkMinNumRegrSamples;
	static const string kPreventionThresholdTime;
	static const string kTestResultCollection;
	static const string kPredictionResultCollection;
	static const string kDatabaseName;
	static const string kMongoDriverRemoteConnectionType;
	static const string kMongoDriverRemoteConnectionHost;
	static const string kMongoDriverRemoteConnectionPort;
	static const string kAgentId;
	static const string kAgentName;
	static const string kStepRunTime;
	static const string kNextRunTime;
	static const string kPriority;
	static const string kStopped;
	static const string kConfigurationCollection;
	static const string kConfigurationAgents;
	static const string kConfTimestamp;
	static const string kAgentPredictor;
	static const string kNumOfAgents;

	


	static const string kDefaultDatabase;
	static const bool kDefaultLocalConfigurationEnable;
	static const bool kDefaultConfigurationFileEnable;
	static const string kDefaultDatabaseConnectionType;
	static const string kDefaultDatabaseConnectionHost;
	static const uint16_t kDefaultDatabaseConnectionPort;

	static const string kDefaultConfigurationCollection;
	static const string kDefaultTestResultCollection;
	static const string kDefaultPredictionResultCollection;

	static const string kDefaultConfigurationSortingAttribute;
	static const string kDefaultConfigurationFile;
	static const string kAgentsConfigurationsKey;

	static const string kDefaultManagerId;
	static const string kDefaultManagerName;
	static const uint64_t kDefaultManagerScheduleTime;
	static const uint64_t kDefaultManagerExecutionWaitTime;

	static const string kDefaultAgentId;
	static const string kDefaultAgentName;
	static const uint64_t kDefaultStepRunTime;
	static const uint64_t kDefaultPreventionThresholdTime;
	static const int kDefaultNumSamplesRead;
	static const unsigned int kDefaultPredictor;
	static const string kDefaultPredictedErrorType;
	static const double kDefaultPredictedErrorValue;
	static const double kDefaultMinOperativeThresholdError;
	static const double kDefaultMaxOperativeThresholdError;
	static const int kDefaultMinNumOfRegrSamples;




	TcErrorDegradationTimeEstimator(bool pLocalFileConfigEnable = kDefaultConfigurationFileEnable, bool pLocalConfigEnable = kDefaultLocalConfigurationEnable, string pLocalConfigFile = kDefaultConfigurationFile, string pDatabaseName = kDefaultDatabase,  string pConfigurationCollection = kDefaultConfigurationCollection, string pMongoDriverRemoteConnectionType = kDefaultDatabaseConnectionType, string pMongoDriverRemoteConnectionHost = kDefaultDatabaseConnectionHost, uint16_t pMongoDriverRemoteConnectionPort = kDefaultDatabaseConnectionPort, string pAgentID = kDefaultAgentId, int pNumSamplesRead = kDefaultNumSamplesRead, unsigned int pPredictor = kDefaultPredictor, string pPredictedErrorType = kDefaultPredictedErrorType, double pPredictedErrorValue = kDefaultPredictedErrorValue, double pMinOperativeThresholdError = kDefaultMinOperativeThresholdError, double pMaxOperativeThresholdError = kDefaultMaxOperativeThresholdError, int pMinNumOfRegrSamples = kDefaultMinNumOfRegrSamples, chrono::microseconds pPreventionThresholdTime = chrono::microseconds(kDefaultPreventionThresholdTime), string pTestResultCollection = kDefaultTestResultCollection, string pPredictionResultCollection = kDefaultTestResultCollection, string pAgentname = kDefaultAgentName, chrono::microseconds pStepRunTime = chrono::microseconds(kDefaultStepRunTime), chrono::time_point<chrono::high_resolution_clock> pNextRunTime = chrono::high_resolution_clock::now(), TcAgent::Priority pPriority = Priority::Medium, bool pStopped = false);
	~TcErrorDegradationTimeEstimator();

	
	virtual int fRun();
	int fGetLastErrors(list<long long> *pTimes, list<double> *pErrors);
	int fGetLastConfigurationFromDatabase();
	int fGetLastConfigurationFromFile();
	int fGetConfiguration();
	void fMakePrediction(list<long long> pTimes, list<double> pErrors, long long *pPrediction, double *pMcoefficient, double* pQoffset, chrono::system_clock::time_point* pStartTrainTime, chrono::system_clock::time_point* pEndTrainTime, chrono::system_clock::time_point* pEndPredictionTime, chrono::system_clock::time_point* pPredictedTimeOfError, chrono::microseconds* pPredictedTimeToError);
	int fNotifyPrediction(chrono::system_clock::time_point pAgentStartTime, long long pLastErrorTime, double pLastError, long long pPrediction, double pMcoefficient, double pQoffset, chrono::system_clock::time_point pStartTrainTime, chrono::system_clock::time_point pEndTrainTime, chrono::system_clock::time_point pEndPredictionTime, chrono::system_clock::time_point pPredictedTimeOfError, chrono::microseconds pPredictedTimeToError);
};





#endif // AGENT_H
