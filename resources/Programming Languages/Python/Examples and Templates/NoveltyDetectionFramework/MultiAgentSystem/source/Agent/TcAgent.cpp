/*# +---------------------------------------------------------+
# |   -=*=-  THIS FILE IS NOT INTENDED FOR SHARING  -=*=-   |
# +---------------------------------------------------------+
# The intellectual and technical concepts are proprietary.
# Dissemination or reproduction is forbidden and may result
# in civil charges and criminal penalties.
*/
#include <stdio.h>
#include <bsoncxx/document/element.hpp>
#include <bsoncxx/json.hpp>
#include <bsoncxx/types.hpp>

#include "../../include/Agent/TcAgent.h"
#include "../../include/TcColors.h"



TcAgent::TcAgent() {
	this->cmMongoInterface = new IMongoDriverAgentInterface();
}
TcAgent::TcAgent(string pDatabaseName, string pMongoDriverRemoteConnectionType, string pMongoDriverRemoteConnectionHost, uint16_t pMongoDriverRemoteConnectionPort, string pAgentID, string pAgentName, chrono::microseconds pStepRunTime, chrono::time_point<chrono::high_resolution_clock> pNextRunTime, IAgent::Priority pPriority, bool pStopped) : IAgent(pAgentID, pAgentName, pStepRunTime, pNextRunTime, pPriority, pStopped) {
	this->rmDatabaseName = pDatabaseName;
	this->rmMongoDriverRemoteConnectionType = pMongoDriverRemoteConnectionType;
	this->rmMongoDriverRemoteConnectionHost = pMongoDriverRemoteConnectionHost;
	this->rmMongoDriverRemoteConnectionPort = pMongoDriverRemoteConnectionPort;
	this->cmMongoInterface = new IMongoDriverAgentInterface("Agent DB Application Interface", pMongoDriverRemoteConnectionType, pMongoDriverRemoteConnectionHost, pMongoDriverRemoteConnectionPort);
}

TcAgent::~TcAgent() {
	if (this->cmMongoInterface == nullptr) {
		delete this->cmMongoInterface;
		this->cmMongoInterface = nullptr;
	}
}

void TcAgent::fSetDatabasename(string pDatabaseName) {
	this->rmDatabaseName = pDatabaseName;
}

string TcAgent::fGetDatabasename() {
	return(this->rmDatabaseName);
}



int TcAgent::fRun() {
	return(kRunSuccess);
}

