/*# +---------------------------------------------------------+
# |   -=*=-  THIS FILE IS NOT INTENDED FOR SHARING  -=*=-   |
# +---------------------------------------------------------+
# The intellectual and technical concepts are proprietary.
# Dissemination or reproduction is forbidden and may result
# in civil charges and criminal penalties.
*/

#pragma once
#ifndef TCONESHOTAGENT_H
#define TCONESHOTAGENT_H

#include "TcAgent.h"

#define FILEPATH_BUFFER_LENGTH 2048

using namespace std;

class TcOneShotAgent : public TcAgent {
private:

	bool fExistOneShotFile();
	bool fDeleteOneShotFile();

public:

	TcOneShotAgent();
	TcOneShotAgent(string pDatabaseName, string pMongoDriverRemoteConnectionType, string pMongoDriverRemoteConnectionHost, uint16_t pMongoDriverRemoteConnectionPort, string pAgentID, string pAgentName, IAgent::Priority pPriority = Priority::Medium);
	~TcOneShotAgent();

	static string fGetCurrentDirectory();


	
	virtual int fRunOneShot();
	virtual int fRun();


};
#endif
