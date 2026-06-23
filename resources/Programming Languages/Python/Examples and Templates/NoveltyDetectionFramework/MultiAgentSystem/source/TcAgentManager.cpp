/*# +---------------------------------------------------------+
# |   -=*=-  THIS FILE IS NOT INTENDED FOR SHARING  -=*=-   |
# +---------------------------------------------------------+
# The intellectual and technical concepts are proprietary.
# Dissemination or reproduction is forbidden and may result
# in civil charges and criminal penalties.
*/




#include "../include/TcAgentManager.h"

#include <thread>
#include <future>
#include <string>
#include <algorithm>
#include <optional>


#include <fstream>
#include <sstream>
#include <string>
#include <algorithm>    // For remove()

#include "../include/IMongoDriverAgentInterface.h"

#define MINWAIT(a,b) (a.count() < b.count() ? a : b)

using namespace std;

TcAgentManager::TcAgentManager(){
	this->cmAgents = new list<IAgent*>();
	this->cmAgentshistory = new map<IAgent*, boost::circular_buffer<TcAgentStatus*>*>();
	this->cmScheduleminwaittime = chrono::microseconds(1000000);
	this->cmExecutionwaittime = chrono::microseconds(1000000);
	this->cmStopped.store(false);
	this->rmMongoDriverRemoteConnectionType = "";
	this->rmMongoDriverRemoteConnectionHost = "";
	this->rmMongoDriverRemoteConnectionPort = 0;
}
TcAgentManager::TcAgentManager(int pNumOfAgents, bool pLocalFileConfigEnable, bool pLocalConfigEnable, string pLocalConfigFile, string pDatabase, string pConfigurationCollection, string pMongoDriverRemoteConnectionType, string pMongoDriverRemoteConnectionHost, uint16_t pMongoDriverRemoteConnectionPort, string pManagerid, string pManagername, chrono::microseconds pSchedulewaittime, chrono::microseconds pExecutionwaittime)
{
	this->rmManagerid = pManagerid;
	this->rmManagername = pManagername;
	this->cmAgents = new list<IAgent*>();
	this->cmAgentshistory = new map<IAgent*, boost::circular_buffer<TcAgentStatus*>*>();
	this->cmScheduleminwaittime = pSchedulewaittime;
	this->cmExecutionwaittime = pExecutionwaittime;
	this->cmStopped.store(false);
	this->rmConfigurationFile = pLocalConfigFile;
	this->rmConfigurationCollection = pConfigurationCollection;
	this->rmDatabase = pDatabase;
	this->rmMongoDriverRemoteConnectionType = pMongoDriverRemoteConnectionType;
	this->rmMongoDriverRemoteConnectionHost = pMongoDriverRemoteConnectionHost;
	this->rmMongoDriverRemoteConnectionPort = pMongoDriverRemoteConnectionPort;
	
	if (pLocalConfigEnable)
	{	
		this->rmNumOfAgents = pNumOfAgents;
	}
	else if (pLocalFileConfigEnable)
	{
		// Get Last Agent Configuration
		int rResult = 0;
		if ((rResult = this->fGetNumOfAgentsFromFile(&(this->rmNumOfAgents))) < 0)
		{
			fprintf(stdout, ANSI_COLOR_RED "(%s) Get configuration data from file fails with error %d" ANSI_COLOR_RESET "\n", __func__, rResult);
			fflush(stdout);
		}
	}
	else
	{
		IMongoDriverAgentInterface cMongoDriverInterface("Temp", pMongoDriverRemoteConnectionType, pMongoDriverRemoteConnectionHost, pMongoDriverRemoteConnectionPort);
		// Get Last Agent Configuration
		int rResult = 0;
		if ((rResult = cMongoDriverInterface.fGetNumOfAgents(pDatabase, pConfigurationCollection, TcAgentManager::kDefaultConfigurationSortingAttribute, &(this->rmNumOfAgents))) < 0)
		{
			fprintf(stdout, ANSI_COLOR_RED "(%s) Get configuration data from database fails with error %d" ANSI_COLOR_RESET "\n", __func__, rResult);
			fflush(stdout);
		}
	}
}
TcAgentManager::~TcAgentManager(){
	
	if (this->cmAgents != nullptr) {
		this->cmAgents->clear();
		delete cmAgents;
	}

	if (this->cmAgentshistory != nullptr) {
		this->cmAgentshistory->clear();
		delete cmAgentshistory;
	}
}


int TcAgentManager::fGetNumOfAgentsFromFile(int *pNumOfAgents)
{

	fprintf(stdout, "(%s) Enter in %s \n", __func__, __func__);
	fflush(stdout);

	try {

		string rConfiguration_file = this->rmConfigurationFile;
		int rNumOfAgents = 0;
		int rResult = 0;
		ifstream cConfiguration_file_is(rConfiguration_file);

		if (!cConfiguration_file_is.is_open()){
			fprintf(stdout, ANSI_COLOR_RED "(%s) Cannot open file %s" ANSI_COLOR_RESET "\n", __func__, rConfiguration_file.c_str());
			fflush(stdout);
			return (-1);
		}

		string rConfiguration;
		string rJsonString((istreambuf_iterator<char>(cConfiguration_file_is)),
					istreambuf_iterator<char>());;
		rJsonString.erase(remove(rJsonString.begin(), rJsonString.end(), '\t'), rJsonString.end());
		rJsonString.erase(remove(rJsonString.begin(), rJsonString.end(), '\n'), rJsonString.end());

		if (rJsonString.empty()){
			fprintf(stdout, ANSI_COLOR_RED "(%s) Configuration string is empty" ANSI_COLOR_RESET "\n", __func__);
			fflush(stdout);
			return (-1);
		}

		if(!rJsonString.empty()){
			bsoncxx::document::value cConfiguration = bsoncxx::from_json(rJsonString);
			auto cAgentConfiguration = cConfiguration.view()[TcAgentManager::kAgentsConfigurationsKey].get_document().value;  
			for (bsoncxx::document::element el : cAgentConfiguration) {
				rNumOfAgents++;
			}
			fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
			fflush(stdout);
			*pNumOfAgents = rNumOfAgents;
		} else{
			fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
			fflush(stdout);
			*pNumOfAgents = 0;
		}
		return (0);

	}
	catch (exception e) {
		fprintf(stdout, "Catched exception - Message %s\n", e.what());
		fflush(stdout);
		fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
		fflush(stdout);
		*pNumOfAgents = 0;
		return (-1);
	}
}

void TcAgentManager::fSetExecutionWaitTime(chrono::microseconds executionwaittime)
{
	this->cmExecutionwaittime = executionwaittime;
}
void TcAgentManager::fSetScheduleMinWaitTime(chrono::microseconds scheduleminwaittime)
{
	this->cmScheduleminwaittime = scheduleminwaittime;
}
void TcAgentManager::fSetName(string managername)
{
	this->rmManagername = managername;
}
void TcAgentManager::fSetStopped(bool stopped)
{
	this->cmStopped.store(stopped);
}
void TcAgentManager::fSetId(string managerid)
{
	this->rmManagerid = managerid;
}

int TcAgentManager::fGetNumOfAgents()
{
    return this->rmNumOfAgents;
}
string TcAgentManager::fGetId()
{
	return(this->rmManagerid);
}
bool TcAgentManager::fGetStopped()
{
	return(this->cmStopped.load());
}
string TcAgentManager::fGetName()
{
	return(this->rmManagername);
}
chrono::microseconds TcAgentManager::fGetScheduleMinWaitTime()
{
	return(this->cmScheduleminwaittime);
}
chrono::microseconds TcAgentManager::fGetExecutionWaitTime()
{
	return(this->cmExecutionwaittime);
}

chrono::microseconds TcAgentManager::fSchedule(priority_queue<IAgent*>* pReadyagents) {
	chrono::microseconds schedulewait = chrono::microseconds(cmScheduleminwaittime);

	fprintf(stdout, "(%s) Start scheduling\n", __func__);
	fflush(stdout);

	for (IAgent* agent : *cmAgents) {
		if (agent->fRunnable()) {
			if (agent->fReady()) {
				schedulewait = chrono::microseconds(0);
				pReadyagents->push(agent);
			} else {
				schedulewait = MINWAIT(schedulewait, agent->fWaitFor());
			}
		}
	}

	fprintf(stdout, "(%s) End scheduling - next programmed scheduling in next %d sec\n", __func__, (int) chrono::duration_cast<chrono::seconds>(schedulewait).count());
	fflush(stdout);
	
	return(schedulewait);
}
void TcAgentManager::fRun(priority_queue<IAgent*>* pReadyagents) {
	try{
		fprintf(stdout, "(%s) Starts Run\n", __func__);
		fflush(stdout);

		while (!pReadyagents->empty()) {

			//chrono::time_point<chrono::high_resolution_clock> 
			auto start = chrono::high_resolution_clock::now();
			bool agentstatus = false;
			optional<int> result = 0;
			promise<optional<int>> p;
			chrono::microseconds agentWait = chrono::microseconds(cmExecutionwaittime);

			IAgent* agent = pReadyagents->top();


			fprintf(stdout, "============================================================================================\n");
			fprintf(stdout, "(%s) Agent with AgentId %s and AgentName %s is starting\n", __func__, agent->fGetId().c_str(), agent->fGetName().c_str());
			fflush(stdout);

			thread agentThread = thread(ref(*agent), ref(p));
			agentThread.detach();
			
			future<optional<int>> f = p.get_future();

			future_status status = f.wait_for(agentWait);
			//chrono::time_point<chrono::high_resolution_clock> end = chrono::high_resolution_clock::now();
			auto end = chrono::high_resolution_clock::now();
			double elapsed_time = chrono::duration<double, milli>(end - start).count();

			if (status == future_status::ready) {
				result = f.get();
				agentstatus = true;
				//fprintf(stdout, "(%s) Ready - Agent ends its task normally in %d ms\n", __func__, (int) chrono::duration_cast<chrono::milliseconds>(end - start).count());
				fprintf(stdout, "(%s) Ready - Agent ends its task normally in %f ms\n", __func__, (double) elapsed_time);
				fflush(stdout);
			} else if (status == future_status::timeout) {
				fprintf(stdout, "(%s) Timeout - Agent doesn't end its task normally in %d ms\n", __func__, (int) chrono::duration_cast<chrono::milliseconds>(end - start).count());
				fflush(stdout);
				agentstatus = false;
			}

			if(this->cmAgentshistory->find(agent) == this->cmAgentshistory->end()) {
				boost::circular_buffer<TcAgentStatus*>* agentStatusList = new boost::circular_buffer<TcAgentStatus*>();
				agentStatusList->push_back(new TcAgentStatus(agentstatus, chrono::duration_cast<chrono::microseconds>(end - start), start));
				this->cmAgentshistory->insert(make_pair(agent, agentStatusList));
			} else {
				this->cmAgentshistory->at(agent)->push_back(new TcAgentStatus(agentstatus, chrono::duration_cast<chrono::microseconds>(end - start), start));
			}

			pReadyagents->pop();
			

			fprintf(stdout, "(%s) Agent with AgentId %s and AgentName %s is ending\n", __func__, agent->fGetId().c_str(), agent->fGetName().c_str());
			fprintf(stdout, "============================================================================================\n");
			fflush(stdout);
							
		}
		fprintf(stdout, "(%s) Ends Running\n", __func__);
		fflush(stdout);
	} catch (exception e) {
		printf("Catched exception - Message %s\n", e.what());
		fflush(stdout);
		fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
		fflush(stdout);
		throw e;
	}

}
void TcAgentManager::fExecute() {
	while (!cmStopped.load()) {
		priority_queue<IAgent*> cReadyagents;
		chrono::microseconds schedulewait = fSchedule(&cReadyagents);
		fRun(&cReadyagents);
		this_thread::sleep_for(schedulewait);
	}
}
void TcAgentManager::fAddAgent(IAgent* agent) {
	this->cmAgents->push_back(agent);
    this->cmAgentshistory->insert(make_pair(agent, new boost::circular_buffer<TcAgentStatus*>(1024)));
}


const string TcAgentManager::kDefaultDatabase = "InfoDB";
const bool TcAgentManager::kDefaultLocalConfigurationEnable = false;
const bool TcAgentManager::kDefaultConfigurationFileEnable = true;
const string TcAgentManager::kDefaultDatabaseConnectionType = "mongodb";
const string TcAgentManager::kDefaultDatabaseConnectionHost = "127.0.0.1";
const uint16_t TcAgentManager::kDefaultDatabaseConnectionPort = (uint16_t) 27017;
const string TcAgentManager::kDefaultConfigurationCollection = "Configuration";
const string TcAgentManager::kDefaultConfigurationSortingAttribute = "timestamp";
const string TcAgentManager::kDefaultConfigurationFile = "../../Configuration.json";
const string TcAgentManager::kAgentsConfigurationsKey = "agents";

const string TcAgentManager::kDefaultManagerId = "AM0";
const string TcAgentManager::kDefaultManagerName = "Agent Manager";
const uint64_t TcAgentManager::kDefaultManagerScheduleTime = (uint64_t) 1000;
const uint64_t TcAgentManager::kDefaultManagerExecutionWaitTime = (uint64_t) 5000;
