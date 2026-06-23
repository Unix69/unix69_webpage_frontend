/*# +---------------------------------------------------------+
# |   -=*=-  THIS FILE IS NOT INTENDED FOR SHARING  -=*=-   |
# +---------------------------------------------------------+
# The intellectual and technical concepts are proprietary.
# Dissemination or reproduction is forbidden and may result
# in civil charges and criminal penalties.
*/

#include   "../../include/Agent/TcAgentStatus.h"

TcAgentStatus::TcAgentStatus() {
	rmStopped = false;
	cmExecutiontime = chrono::microseconds(0);
	cmStarttime = chrono::high_resolution_clock::now();
};
TcAgentStatus::TcAgentStatus(bool stopped, chrono::microseconds executiontime, chrono::time_point<chrono::high_resolution_clock> starttime) {
	rmStopped = stopped;
	cmExecutiontime = executiontime;
	cmStarttime = starttime;
}
TcAgentStatus::TcAgentStatus(const TcAgentStatus& other) {
	rmStopped = other.rmStopped;
	cmExecutiontime = other.cmExecutiontime;
	cmStarttime = other.cmStarttime;
}
TcAgentStatus::TcAgentStatus(TcAgentStatus&& other) {
	rmStopped = other.rmStopped;
	cmExecutiontime = other.cmExecutiontime;
	cmStarttime = other.cmStarttime;
	other.rmStopped = false;
	other.cmExecutiontime = chrono::microseconds(0);
	other.cmStarttime = chrono::time_point<chrono::high_resolution_clock>();
}
TcAgentStatus::~TcAgentStatus() { ; }
TcAgentStatus& TcAgentStatus::operator=(const TcAgentStatus& other) {

	if (this != &other) {
		rmStopped = other.rmStopped;
		cmExecutiontime = other.cmExecutiontime;
		cmStarttime = other.cmStarttime;
	}

	return(*this);

}
TcAgentStatus& TcAgentStatus::operator=(TcAgentStatus&& other) {

	if (this != &other) {
		rmStopped = other.rmStopped;
		cmExecutiontime = other.cmExecutiontime;
		cmStarttime = other.cmStarttime;
		other.rmStopped = false;
		other.cmExecutiontime = chrono::microseconds(0);
		other.cmStarttime = chrono::time_point<chrono::high_resolution_clock>();
	}

	return(*this);
}

void TcAgentStatus::fSetStopped(bool stopped)
{
	rmStopped = stopped;
}
void TcAgentStatus::fSetExecutionTime(chrono::microseconds execution_time)
{
	cmExecutiontime = execution_time;
}
void TcAgentStatus::fSetStartTime(chrono::time_point<chrono::high_resolution_clock> start_time)
{
	cmStarttime = start_time;
}

bool TcAgentStatus::fGetStopped()
{
	return(rmStopped);
}
chrono::microseconds TcAgentStatus::fGetExecutionTime()
{
	return(cmExecutiontime);
}
chrono::time_point<chrono::high_resolution_clock> TcAgentStatus::fGetStartTime()
{
	return(cmStarttime);
}
