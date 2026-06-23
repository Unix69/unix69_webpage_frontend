#!/bin/sh

#Check for ROOT permissions, python program require root permissions to execute
if [ "`id -u`" -ne 0 ]; then
 exec sudo "$0" "$@"
 exit 0
fi

#Declare script support variables
RED=$(tput setaf 1)
GREEN=$(tput setaf 2)
NC=$(tput sgr0)
pythonPrg="source/main.py"
pythonExe="python3.8"

echo "Launch MQTT Data Loader..."

( $pythonExe $pythonPrg "$@" ) || { exitCode=$?; echo "${RED}Unable to launch MQTT Data Loader${NC}"; echo "$0: Error, exit with code $exitCode"; exit $exitCode; }
if [ $? -ne 0 ]; then
	echo "${RED}Launch of MQTT Data Loader fails, with error $?${NC}"
	exit 1
else
	echo "${GREEN}MQTT Data Loader ended successfully ${NC}"
	exit 0
fi

