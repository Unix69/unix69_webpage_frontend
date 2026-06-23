#!/bin/sh

#Check for ROOT permissions, python program require root permissions to execute
if [ "`id -u`" -ne 0 ]; then
 exec sudo "$0"
 exit 0
fi

RED=$(tput setaf 1)
GREEN=$(tput setaf 2)
NC=$(tput sgr0)

#Declare script support variables
pythonSupportPackages="python3-distutils python3-apt"
pythonRequirementsFile="./python_requirements"
python="python3.8"
pip="pip3"
pip_pkg="python3-pip"


#Update the source list before installing python and python dependencies
(sudo add-apt-repository universe) || { exitCode=$?; echo "${RED}Unable to add universe repository${NC}"; echo "$0: Error, exit with code $exitCode"; exit $exitCode; }
(sudo apt-get update --assume-yes) || { exitCode=$?; echo "${RED}Unable to update the source list${NC}"; echo "$0: Error, exit with code $exitCode"; exit $exitCode; }


#Update the packages list and install the packages necessary to install Python
echo "Install build essential"
(sudo apt-get install --assume-yes $pythonSupportPackages) || { exitCode=$?; echo "${RED}Unable to install $pythonSupportPackages${NC}"; echo "$0: Error, exit with code $exitCode"; exit $exitCode; }
echo "${GREEN}Build essentials successfully installed${NC}"

#Check for Python installation
if hash $python 2>/dev/null; then
        echo "${GREEN}$python already installed${NC}"
else
#Install Python
        echo "Start $python installation..."
        # Install Python
        (sudo apt-get install --assume-yes $python) || { echo "$0: Error, exit with code $?"; exit $?; }
        
        #Verify Python installation
        if hash $python 2>/dev/null; then
          echo "${GREEN}$python sucessfully installed${NC}"
        else
          echo "${RED}Unable to install $python${NC}"
          exit 1
        fi
fi

# Pip
if hash $pip 2>/dev/null; then
        #Check for Pip installation
        echo "${GREEN}$pip already installed${NC}"
else
        #Install Pip
        echo "Start $pip installation..."
        (sudo apt-get install --assume-yes -q $pip_pkg) || { echo "$0: Error, exit with code $?"; exit $?; }
        #Verify Python installation
        if hash $pip 2>/dev/null; then
          echo "${GREEN}$pip sucessfully installed${NC}"          
        else
          echo "${RED}Unable to install $pip${NC}"
          exit 2
        fi
fi

# Install Python packages
($pip install --no-input -r $pythonRequirementsFile) || { exitCode=$?; echo "${RED}Unable to install Python requirements $pythonRequirementsFile${NC}"; echo "$0: Error, exit with code $exitCode"; exit $exitCode; }
if [ $? -eq 0 ]; then
  echo "${GREEN}Python packages installed successfully${NC}"
else
  echo "${RED}Unable to install Python packages${NC}" 
fi

echo "${GREEN}Python and Python dependencies successfully installed${NC}"
exit 0

