/*# +---------------------------------------------------------+
# |   -=*=-  THIS FILE IS NOT INTENDED FOR SHARING  -=*=-   |
# +---------------------------------------------------------+
# The intellectual and technical concepts are proprietary.
# Dissemination or reproduction is forbidden and may result
# in civil charges and criminal penalties.
*/

#pragma once

#ifndef IAGENT_H
#define IAGENT_H

#include <optional>
#include <chrono>
#include <future>
#include <list>

using namespace std;

class IAgent {
public:
	enum class Priority { VeryHigh = 5, High = 4, Medium = 3, Low = 2, VeryLow = 1 };
	
	string rmAgentID;
	string rmAgentName;
	atomic<bool> cmStopped;
	Priority cmRunPriority;
	chrono::time_point<chrono::high_resolution_clock> cmLastRunTime;
	chrono::time_point<chrono::high_resolution_clock> cmNextRunTime;
	chrono::microseconds cmStepRunTime;

	IAgent();
	IAgent(string pAgentID, string pAgentName, chrono::microseconds pStepRunTime, chrono::time_point<chrono::high_resolution_clock> pNextruntime = chrono::high_resolution_clock::now(), Priority pPriority = Priority::Medium, bool pStopped = false);
	IAgent(const IAgent& other);
	IAgent(IAgent&& other);
	~IAgent();


	IAgent& operator=(const IAgent& other);
	IAgent& operator=(IAgent&& other);


	void fSetLastRunTime(chrono::time_point<chrono::high_resolution_clock> lastruntime);
	void fSetNextRunTime(chrono::time_point<chrono::high_resolution_clock> nextruntime);
	void fSetStepRunTime(chrono::microseconds stepruntime);
	void fSetName(string agentname);
	void fSetStopped(bool stopped);
	void fSetRunPriority(Priority runpriority);
	void fSetId(string agentid);

	string fGetId();
	Priority fGetRunPriority();
	bool fGetStopped();
	string fGetName();
	chrono::time_point<chrono::high_resolution_clock> fGetLastRunTime();
	chrono::time_point<chrono::high_resolution_clock> fGetNextRunTime();
	chrono::microseconds fGetStepRunTime();

	bool fRunnable();
	bool fReady();
	virtual int fRun();
	chrono::microseconds fWaitFor();

	void operator()(promise<optional<int>>& promise);
	bool operator<(const IAgent& Ragent);
	bool operator==(const IAgent& Ragent);
	bool operator>(const IAgent& Ragent);
	bool operator<=(IAgent& Ragent);
	bool operator>=(const IAgent& Ragent);
	bool operator!=(const IAgent& Ragent);

};

#endif // IAGENT_H

