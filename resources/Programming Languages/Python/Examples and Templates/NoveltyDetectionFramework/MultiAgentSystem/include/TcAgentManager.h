/*# +---------------------------------------------------------+
# |   -=*=-  THIS FILE IS NOT INTENDED FOR SHARING  -=*=-   |
# +---------------------------------------------------------+
# The intellectual and technical concepts are proprietary.
# Dissemination or reproduction is forbidden and may result
# in civil charges and criminal penalties.
*/

#pragma once

#ifndef TCAGENTMANAGER_H
#define TCAGENTMANAGER_H

#include <map>
#include <string>
#include <list>
#include <queue>
#include <boost/circular_buffer.hpp>
#include <boost/circular_buffer_fwd.hpp>

#include "Agent/IAgent.h"
#include "Agent/TcAgentStatus.h"


using namespace std;

class TcAgentManager {

private:

	string rmManagername;
	string rmManagerid;
	list<IAgent*>* cmAgents;
	map<IAgent*, boost::circular_buffer<TcAgentStatus*>* >* cmAgentshistory;
	chrono::microseconds cmScheduleminwaittime;
	chrono::microseconds cmExecutionwaittime;
	atomic<bool> cmStopped;

	int rmNumOfAgents;
	string rmConfigurationFile;
	string rmConfigurationCollection;
	string rmDatabase;

	string rmMongoDriverRemoteConnectionType;
	string rmMongoDriverRemoteConnectionHost;
	uint16_t rmMongoDriverRemoteConnectionPort;


	static const string kDefaultConfigurationFile;
	static const bool kDefaultConfigurationFileEnable;
	static const bool kDefaultLocalConfigurationEnable;
	static const string kDefaultDatabase;
	static const string kDefaultConfigurationCollection;
	static const string kDefaultConfigurationSortingAttribute;
	static const string kDefaultDatabaseConnectionType;
	static const string kDefaultDatabaseConnectionHost;
	static const uint16_t kDefaultDatabaseConnectionPort;
	

	static const string kDefaultManagerId;
	static const string kDefaultManagerName;
	static const uint64_t kDefaultManagerScheduleTime;
	static const uint64_t kDefaultManagerExecutionWaitTime;
	

public:

	static const string kAgentsConfigurationsKey;

	TcAgentManager();
	TcAgentManager(int pNumOfAgents, bool pLocalFileConfigEnable = kDefaultConfigurationFileEnable, bool pLocalConfigEnable = kDefaultLocalConfigurationEnable, string pLocalConfigFile = kDefaultConfigurationFile, string pDatabase = kDefaultDatabase, string pConfigurationCollection = kDefaultConfigurationCollection, string pMongoDriverRemoteConnectionType = kDefaultDatabaseConnectionType, string pMongoDriverRemoteConnectionHost = kDefaultDatabaseConnectionHost, uint16_t pMongoDriverRemoteConnectionPort = kDefaultDatabaseConnectionPort, string pManagerid = kDefaultManagerId, string pManagername = kDefaultManagerName, chrono::microseconds pSchedulewaittime = chrono::microseconds(kDefaultManagerScheduleTime), chrono::microseconds pExecutionwaittime = chrono::microseconds(kDefaultManagerExecutionWaitTime));
	~TcAgentManager();


	void fAddAgent(IAgent* pAgent);

	chrono::microseconds fSchedule(priority_queue<IAgent*>* pReadyagents);
	void fRun(priority_queue<IAgent*>* pReadyagents);

	void fExecute();

	int fGetNumOfAgentsFromFile(int *pNumOfAgents);

	void fSetExecutionWaitTime(chrono::microseconds pExecutionwaittime);
	void fSetScheduleMinWaitTime(chrono::microseconds pScheduleminwaittime);
	void fSetName(string pManagername);
	void fSetStopped(bool pStopped);
	void fSetId(string agentid);

	int fGetNumOfAgents();
	string fGetId();
	bool fGetStopped();
	string fGetName();
	chrono::microseconds fGetScheduleMinWaitTime();
	chrono::microseconds fGetExecutionWaitTime();
};

#endif // AGENTMANAGER_H
