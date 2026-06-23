/*# +---------------------------------------------------------+
# |   -=*=-  THIS FILE IS NOT INTENDED FOR SHARING  -=*=-   |
# +---------------------------------------------------------+
# The intellectual and technical concepts are proprietary.
# Dissemination or reproduction is forbidden and may result
# in civil charges and criminal penalties.
*/

#include "../../include/Agent/TcOneShotAgent.h"

#include <sys/stat.h>
#include "../../include/TcColors.h"

using namespace std;

#define FILEPATH_BUFFER_LENGTH 2048

#ifdef _WIN32
	#include <direct.h>
	#define GetCurrentWorkingDirectory _getcwd
#elif defined __linux__
	#include <unistd.h>
	#define GetCurrentWorkingDirectory getcwd
#endif



TcOneShotAgent::TcOneShotAgent() { ; }
TcOneShotAgent::TcOneShotAgent(string pDatabaseName, string pMongoDriverRemoteConnectionType, string pMongoDriverRemoteConnectionHost, uint16_t pMongoDriverRemoteConnectionPort, string pAgentID, string pAgentName, IAgent::Priority pPriority) : TcAgent(pDatabaseName, pMongoDriverRemoteConnectionType, pMongoDriverRemoteConnectionHost, pMongoDriverRemoteConnectionPort, pAgentID, pAgentName, chrono::microseconds(0), chrono::high_resolution_clock::now(), pPriority, false) { ; }
TcOneShotAgent::~TcOneShotAgent(){ ; }




string TcOneShotAgent::fGetCurrentDirectory() {
	
	char aCurrentWorkingDirectory[FILENAME_MAX];
	return(string(GetCurrentWorkingDirectory(aCurrentWorkingDirectory, FILENAME_MAX)));

}

bool TcOneShotAgent::fExistOneShotFile() {
	

	char rOneShotFilePath[FILEPATH_BUFFER_LENGTH];
	snprintf(rOneShotFilePath, (size_t)FILEPATH_BUFFER_LENGTH, "%s\\%s_OneShot.ini", fGetCurrentDirectory().c_str(), this->rmAgentID.c_str());

	fprintf(stdout, "[fExistOneShotFile] Look for file %s\n", rOneShotFilePath);
    fflush(stdout);
	
	

	#ifdef _WIN32
		#define Stat _stat64i32
		struct _stat64i32 rStat_Buffer;
	#elif defined __linux__
		#define Stat stat
		struct stat rStat_Buffer;
	#endif

	if(!Stat(rOneShotFilePath, &rStat_Buffer)) {
        return(true);
    } else {
        return(false);
	}



}
bool TcOneShotAgent::fDeleteOneShotFile() { 

    char rOneShotFilePath[FILEPATH_BUFFER_LENGTH];
    snprintf(rOneShotFilePath, (size_t)FILEPATH_BUFFER_LENGTH, "%s/%s_OneShot.ini\n", TcOneShotAgent::fGetCurrentDirectory().c_str(), this->rmAgentID.c_str());

	fprintf(stdout, "[fDeleteOneShotFile] Delete file %s\n", rOneShotFilePath);
    fflush(stdout);
	
    if (fExistOneShotFile()) {
        if (remove(rOneShotFilePath)) {
            fprintf(stdout, ANSI_COLOR_RED "One Shot File %s "  ANSI_COLOR_RESET " not found\n", rOneShotFilePath);
		    fflush(stdout);
            return(false);
        } else {
            return(true);
	    }
    } else {
        return(true);
	}
 }
int TcOneShotAgent::fRunOneShot() { 
	return 0;
}



int TcOneShotAgent::fRun() {
	int rResult = 0;

	if (fExistOneShotFile()) {
		fprintf(stdout, ANSI_COLOR_CYAN "One Shot %s"  ANSI_COLOR_RESET "\n", this->rmAgentID.c_str());
		fflush(stdout);
		fRunOneShot();
        fDeleteOneShotFile();
        return(kRunSuccess);
	} else {
        fprintf(stdout, ANSI_COLOR_CYAN "One Shot %s doesn't run"  ANSI_COLOR_RESET "\n", this->rmAgentID.c_str());
		fflush(stdout);
		return(kRunFails);
    }

}










