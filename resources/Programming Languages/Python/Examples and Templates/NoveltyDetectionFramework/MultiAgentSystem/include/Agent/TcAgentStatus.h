/*# +---------------------------------------------------------+
# |   -=*=-  THIS FILE IS NOT INTENDED FOR SHARING  -=*=-   |
# +---------------------------------------------------------+
# The intellectual and technical concepts are proprietary.
# Dissemination or reproduction is forbidden and may result
# in civil charges and criminal penalties.
*/

#pragma once

#ifndef TCAGENTSTATUS_H
#define TCAGENTSTATUS_H

#include <string>
#include <chrono>

		using namespace std;

		class TcAgentStatus {

		private:

			bool rmStopped;
			chrono::time_point<chrono::high_resolution_clock> cmStarttime;
			chrono::microseconds cmExecutiontime;

		public:
			TcAgentStatus();
			TcAgentStatus(bool rmStopped, chrono::microseconds pExecutiontime, chrono::time_point<chrono::high_resolution_clock> pStarttime);
			TcAgentStatus(const TcAgentStatus& pOther);
			TcAgentStatus(TcAgentStatus&& pOther);
			~TcAgentStatus();

			TcAgentStatus& operator=(const TcAgentStatus& pOther);
			TcAgentStatus& operator=(TcAgentStatus&& pOther);


			bool operator==(const TcAgentStatus& pLAgentStatus);

			void fSetStopped(bool pStopped);
			void fSetExecutionTime(chrono::microseconds pExecutiontime);
			void fSetStartTime(chrono::time_point<chrono::high_resolution_clock> pStarttime);

			bool fGetStopped();
			chrono::microseconds fGetExecutionTime();
			chrono::time_point<chrono::high_resolution_clock> fGetStartTime();
		};
#endif // AGENTINFO_H
