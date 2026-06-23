/*# +---------------------------------------------------------+
# |   -=*=-  THIS FILE IS NOT INTENDED FOR SHARING  -=*=-   |
# +---------------------------------------------------------+
# The intellectual and technical concepts are proprietary.
# Dissemination or reproduction is forbidden and may result
# in civil charges and criminal penalties.
*/

#pragma once
#ifndef TCAGENT_H
#define TCAGENT_H


#include <string>
#include <chrono>

#include "IAgent.h"
#include "../IMongoDriverAgentInterface.h"


using namespace std;


class TcAgent : public IAgent {
protected:
	constexpr static const int8_t kGetDataFails = -1;
	constexpr static const int8_t kGetDataSuccess = 0;
	constexpr static const int8_t kNotifyFails = -1;
	constexpr static const int8_t kNotifySuccess = 0;
	constexpr static const int8_t kRunFails = -1;
	constexpr static const int8_t kRunSuccess = 0;

	IMongoDriverAgentInterface* cmMongoInterface;
	string rmDatabaseName;
	string rmMongoDriverRemoteConnectionType;
	string rmMongoDriverRemoteConnectionHost;
	uint16_t rmMongoDriverRemoteConnectionPort;



public:

	TcAgent();
	TcAgent(string pDatabaseName, string pMongoDriverRemoteConnectionType, string pMongoDriverRemoteConnectionHost, uint16_t pMongoDriverRemoteConnectionPort, string pAgentID, string pAgentName, chrono::microseconds pStepRunTime = chrono::microseconds(0), chrono::time_point<chrono::high_resolution_clock> pNextRunTime = chrono::high_resolution_clock::now(), Priority pPriority = Priority::Medium, bool pStopped = false);
	~TcAgent();
	virtual int fRun();

	string fGetDatabasename();
	void fSetDatabasename(string pDatabaseName);

};

#endif // AGENT_H
