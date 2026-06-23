/*# +---------------------------------------------------------+
# |   -=*=-  THIS FILE IS NOT INTENDED FOR SHARING  -=*=-   |
# +---------------------------------------------------------+
# The intellectual and technical concepts are proprietary.
# Dissemination or reproduction is forbidden and may result
# in civil charges and criminal penalties.
*/

// AgentSystem.h : Include file for standard system include files,
// or project specific include files.
#pragma once

#ifndef TCAGENTSYSTEM_H
#define TCAGENTSYSTEM_H



#include <string>

#define ANSI_COLOR_RED     "\x1b[31m"
#define ANSI_COLOR_GREEN   "\x1b[32m"
#define ANSI_COLOR_YELLOW  "\x1b[33m"
#define ANSI_COLOR_BLUE    "\x1b[34m"
#define ANSI_COLOR_MAGENTA "\x1b[35m"
#define ANSI_COLOR_CYAN    "\x1b[36m"
#define ANSI_COLOR_RESET   "\x1b[0m"

#include "TcAgentManager.h"
#include "Agent/IAgent.h"

using namespace std;

class TcAgentSystem {
	private:
		string rmSystemid;
		string rmSystemname;
		TcAgentManager* cmManager;

	public:

		TcAgentSystem(string pSystemid, string pSystemname);
		~TcAgentSystem();

		void fLoadManager(bool pLocalFileConfigEnable, bool pLocalConfigEnable, string pLocalConfigFile, string pDatabase, string pConfigurationCollection, string pMongoDriverRemoteConnectionType, string pMongoDriverRemoteConnectionHost, uint16_t pMongoDriverRemoteConnectionPort, string pManagerid, string pManagername, chrono::microseconds pScheduleminwaittime, chrono::microseconds pExecutionwaittime);

		void fStartManager(thread* pManagerThread);
		void fWaitManager(thread* pManagerThread);

		void fExecuteManager();
		void fStopManager();
		void fLoadAgent(IAgent* pAgent);

		void fSetName(string pSystemname);
		void fSetId(string pSystemid);
		void fSetManager(TcAgentManager* pManager);

		TcAgentManager* fGetManager();
		string fGetId();
		string fGetName();
};
		


#endif // AGENTSYSTEM_H
