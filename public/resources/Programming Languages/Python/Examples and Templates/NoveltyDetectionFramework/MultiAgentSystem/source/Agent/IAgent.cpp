/*# +---------------------------------------------------------+
# |   -=*=-  THIS FILE IS NOT INTENDED FOR SHARING  -=*=-   |
# +---------------------------------------------------------+
# The intellectual and technical concepts are proprietary.
# Dissemination or reproduction is forbidden and may result
# in civil charges and criminal penalties.
*/

#include <chrono>
#include <string>

#include "../../include/Agent/IAgent.h"



IAgent::IAgent() {
	rmAgentID = "";
	rmAgentName = "";
	cmRunPriority = Priority::Medium;
	cmStopped.store(false);
	cmStepRunTime = chrono::microseconds(60000000);
	cmLastRunTime = chrono::high_resolution_clock::now();
	cmNextRunTime = cmLastRunTime + cmStepRunTime;
}
IAgent::IAgent(string pAgentID, string AgentName, chrono::microseconds pStepRunTime, chrono::time_point<chrono::high_resolution_clock> pNextRunTime, Priority pPriority, bool pStopped){
	rmAgentID = pAgentID;
	rmAgentName = AgentName;
	cmRunPriority = pPriority;
	cmStopped.store(pStopped);
	cmStepRunTime = pStepRunTime;
	cmLastRunTime = chrono::high_resolution_clock::now();
	cmNextRunTime = pNextRunTime;
}
IAgent::IAgent(const IAgent& other) {
	rmAgentID = other.rmAgentID;
	rmAgentName = other.rmAgentName;
	cmRunPriority = other.cmRunPriority;
	cmStopped.store(other.cmStopped.load());
	cmStepRunTime = other.cmStepRunTime;
	cmLastRunTime = other.cmLastRunTime;
	cmNextRunTime = other.cmNextRunTime;
}
IAgent::IAgent(IAgent&& other) {
	rmAgentID = other.rmAgentID;
    rmAgentName = other.rmAgentName;
	cmRunPriority = other.cmRunPriority;
	cmStopped.store(other.cmStopped.load());
	cmStepRunTime = other.cmStepRunTime;
	cmLastRunTime = other.cmLastRunTime;
	cmNextRunTime = other.cmNextRunTime;
	other.rmAgentID = "";
	other.rmAgentName = "";
	other.cmRunPriority = Priority::Medium;
	other.cmStopped.store(false);
	other.cmStepRunTime = chrono::microseconds(0);
	other.cmLastRunTime = chrono::time_point<chrono::high_resolution_clock>();
	other.cmNextRunTime = chrono::time_point<chrono::high_resolution_clock>();
}
IAgent::~IAgent(){}
IAgent& IAgent::operator=(const IAgent& other){
	
	if (this != &other) {
		rmAgentID = other.rmAgentID;
		rmAgentName = other.rmAgentName;
		cmRunPriority = other.cmRunPriority;
		cmStopped.store(other.cmStopped.load());
		cmStepRunTime = other.cmStepRunTime;
		cmLastRunTime = other.cmLastRunTime;
		cmNextRunTime = other.cmNextRunTime;
	}

	return(*this);

}
IAgent& IAgent::operator=(IAgent&& other) {

	if (this != &other) {
		rmAgentID = other.rmAgentID;
		rmAgentName = other.rmAgentName;
		cmRunPriority = other.cmRunPriority;
		cmStopped.store(other.cmStopped.load());
		cmStepRunTime = other.cmStepRunTime;
		cmLastRunTime = other.cmLastRunTime;
		cmNextRunTime = other.cmNextRunTime;
		other.rmAgentID = "";
		other.rmAgentName = "";
		other.cmRunPriority = Priority::Medium;
		other.cmStopped.store(false);
		other.cmStepRunTime = chrono::microseconds(0);
		other.cmLastRunTime = chrono::time_point<chrono::high_resolution_clock>();
		other.cmNextRunTime = chrono::time_point<chrono::high_resolution_clock>();
	}

	return(*this);

}

void IAgent::fSetLastRunTime(chrono::time_point<chrono::high_resolution_clock> last_runtime)
{
	last_runtime = last_runtime;
}

void IAgent::fSetNextRunTime(chrono::time_point<chrono::high_resolution_clock> nextruntime)
{
	cmNextRunTime = nextruntime;
}

void IAgent::fSetStepRunTime(chrono::microseconds stepruntime)
{
	cmStepRunTime = stepruntime;
}

void IAgent::fSetName(string agentname)
{
	rmAgentName = agentname;
}

void IAgent::fSetStopped(bool stopped)
{
	cmStopped.store(stopped);
}

void IAgent::fSetRunPriority(Priority runpriority)
{
	cmRunPriority = runpriority;
}

void IAgent::fSetId(string agentid)
{
	rmAgentID = agentid;
}

string IAgent::fGetId()
{
	return(rmAgentID);
}

IAgent::Priority IAgent::fGetRunPriority()
{
	return(cmRunPriority);
}

bool IAgent::fGetStopped()
{
	return(cmStopped.load());
}

string IAgent::fGetName()
{
	return(rmAgentName);
}

chrono::time_point<chrono::high_resolution_clock> IAgent::fGetLastRunTime()
{
	return(cmLastRunTime);
}

chrono::microseconds IAgent::fGetStepRunTime()
{
	return(cmStepRunTime);
}

chrono::time_point<chrono::high_resolution_clock> IAgent::fGetNextRunTime()
{
	return(cmNextRunTime);
}

chrono::microseconds IAgent::fWaitFor(){
	chrono::microseconds waitfor = chrono::duration_cast<chrono::microseconds>(cmNextRunTime - chrono::high_resolution_clock::now());
	return(waitfor.count() > 0 ? waitfor : chrono::microseconds(0));
}

bool IAgent::fRunnable() {
	return(!cmStopped.load());
}

bool IAgent::fReady() {
	return(cmNextRunTime < chrono::high_resolution_clock::now());
}

int IAgent::fRun(){
	return(0);
}

void IAgent::operator()(promise<optional<int>>& promise) {
	try {

		chrono::time_point<chrono::high_resolution_clock> start = chrono::high_resolution_clock::now();

		int result = fRun();
		promise.set_value_at_thread_exit(result);

		chrono::time_point<chrono::high_resolution_clock> end = chrono::high_resolution_clock::now();
		this->cmLastRunTime = end;
		this->cmNextRunTime = end + this->cmStepRunTime;
	
	}
	catch (exception e) {
		promise.set_exception_at_thread_exit(exception_ptr());
	}
}





bool IAgent::operator<(const IAgent& Ragent) {
	return((this->cmRunPriority > Ragent.cmRunPriority ? true : this->cmNextRunTime < Ragent.cmNextRunTime));
}

bool IAgent::operator==(const IAgent& Ragent) {
	return(this->cmRunPriority == Ragent.cmRunPriority && this->cmNextRunTime == Ragent.cmNextRunTime);
}

bool IAgent::operator>(const IAgent& Ragent) {
	return(!(*this == Ragent) && !(*this < Ragent));
}

bool IAgent::operator<=(IAgent& Ragent) {
	return(!(*this > Ragent));
}

bool IAgent::operator>=(const IAgent& Ragent) {
	return(!(*this < Ragent));
}

bool IAgent::operator!=(const IAgent& Ragent) {
	return(*this < Ragent || *this > Ragent);
}


