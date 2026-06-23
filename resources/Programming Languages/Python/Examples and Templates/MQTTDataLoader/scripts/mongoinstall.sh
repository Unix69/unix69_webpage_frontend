#!/bin/sh

#Check for ROOT permissions, mongod require root directory to execute
if [ "`id -u`" -ne 0 ]; then
    exec sudo "$0" "$@"
    exit 0
fi


#Declare script support variables
RED=$(tput setaf 1)
GREEN=$(tput setaf 2)
NC=$(tput sgr0)

mongodbBuildSupportPackages="wget openssl liblzma5"

#Manage script arguments
if [ "$#" -eq 0 ]; then
    mongodbDataPath="/var/mongodb/data"
    mongodbLogPath="/var/mongodb/log"
elif [ "$#" -eq 3 ]; then
    mongodbDataPath=$1
    mongodbLogPath=$2
else
    echo "${RED}Wrong number of arguments: launch $0 [MongoDB_Data_Folder_Path] [MongoDB_Log_Folder_Path] or launch $0 without arguments${NC}"
    exit 1
fi

echo "Start MongoDB installation..."

#Install the packages necessary to download and install MongoDB
echo "Install build essential"
(sudo apt-get install --assume-yes $mongodbBuildSupportPackages) || { exitCode=$?; echo "${RED}Unable to install $mongodbBuildSupportPackages${NC}"; echo "$0: Error, exit with code $exitCode"; exit $exitCode; }
echo "${GREEN}Build essentials successfully installed${NC}"

#Download and install MongoDB binaries
echo "Download MongoDB 4.4.15"

(wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -) || { exitCode=$?; echo "${RED}Unable to add repository key${NC}"; echo "$0: Error, exit with code $exitCode"; exit $exitCode; }
(echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list) || { exitCode=$?; echo "${RED}Unable to add MongoDB to source list${NC}"; echo "$0: Error, exit with code $exitCode"; exit $exitCode; }
(sudo apt-get update) || { exitCode=$?; echo "${RED}Unable to update the system${NC}"; echo "$0: Error, exit with code $exitCode"; exit $exitCode; }
(sudo apt-get install -y mongodb-org=4.4.15 mongodb-org-server=4.4.15 mongodb-org-shell=4.4.15 mongodb-org-mongos=4.4.15 mongodb-org-tools=4.4.15) || { exitCode=$?; echo "${RED}Unable to install MongoDB${NC}"; echo "$0: Error, exit with code $exitCode"; exit $exitCode; }

#Download and install MongoDB Compass
(wget https://downloads.mongodb.com/compass/mongodb-compass_1.39.3_amd64.deb) || { exitCode=$?; echo "${RED}Unable to download MongoDB Compass${NC}"; echo "$0: Error, exit with code $exitCode"; exit $exitCode; }
(sudo dpkg -i mongodb-compass_1.39.3_amd64.deb) || { exitCode=$?; echo "${RED}Unable to install MongoDB Compass${NC}"; echo "$0: Error, exit with code $exitCode"; exit $exitCode; }
(rm -f mongodb-compass_1.39.3_amd64.deb) || { exitCode=$?; echo "${RED}Unable to remove mongodb-compass_1.39.3_amd64.deb${NC}"; echo "$0: Error, exit with code $exitCode"; exit $exitCode; }

echo "Setup MongoDB data and log folders"

#Create data directory
(sudo mkdir -p $mongodbDataPath) || { exitCode=$?; echo "${RED}Unable to create directory $mongodbDataPath${NC}"; echo "$0: Error, exit with code $exitCode"; exit $exitCode; }

#Set data directory ownership
(sudo chown `whoami` $mongodbDataPath) || { exitCode=$?; echo "${RED}Unable to set ownership of $mongodbDataPath to $(whoami)${NC}"; echo "$0: Error, exit with code $exitCode"; exit $exitCode; }

#Create log directory
(mkdir -p $mongodbLogPath) || { exitCode=$?; echo "${RED}Unable to create directory $mongodbLogPath${NC}"; echo "$0: Error, exit with code $exitCode"; exit $exitCode; }

#Set log directory ownership
(sudo chown `whoami` $mongodbLogPath) || { exitCode=$?; echo "${RED}Unable to set ownership of $mongodbLogPath to $(whoami)${NC}"; echo "$0: Error, exit with code $exitCode"; exit $exitCode; }

echo "MongoDB setup complete"
echo "MongoDB installation datapath=$mongodbDataPath"
echo "MongoDB installation logpath=$mongodbLogPath"
echo "${GREEN}MongoDB 4.4.15 installation complete${NC}"

exit 0






