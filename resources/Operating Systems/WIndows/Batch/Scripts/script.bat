@echo off

SETLOCAL ENABLEEXTENSION

#generate private encryption key 

SET /A maxrandom = 1000000
SET /A minrandom = 0
SET /A normrand = 32768
SET /A test= %RANDOM% * %maxrandom% / %normrand% + %minrandom%
SET exitstatus = %test%
SET numargs = 10 
SET count = 0



:ARG_AQUIRE
SHIFT
IF %0 == "" GOTO ARG_CTRL
SET param[%count%] = %0 
SET /A count = %count% + 1
GOTO ARG_AQUIRE

:ARG_CTRL
IF %numargs%==%count% GOTO MAIN
SET /A exitstatus=-1
GOTO END

SET opensslroot=param[0] # eg .\GnuWin32\bin
SET opensslconffile=param[1] #eg .\GnuWin32\share\openssl.cnf 
SET cacertfile=param[2] # eg .\GnuWin32\demoCA\cacert.pem
SET cakeyfile=param[3] # eg .\GnuWin32\demoCA\private\cakey.pem
SET serversecuritydir=param[4] # eg .\Security\Server
SET clientsecuritydir=param[5] # eg .\Security\Client
SET casecuritydir=param[6] # eg .\Security\CA
SET certaccesspass=param[7] # eg alphanumstring

:MAIN 


#validate input and set other variables
FOR /L %%I IN (0,1,%numargs% - 1) DO IF NOT EXIST %param[%%I]% (SET /A exitstatus=-1 && GOTO END)
FOR %%F IN (%param%) DO IF NOT EXIST %%F (SET /A exitstatus=-1 && GOTO END)

SET clientcertfile = %clientsecuritydir%\client.crt
SET clientkeyfile =  %clientsecuritydir%\client.key
SET clientcsrfile =  %clientsecuritydir%\client.csr
SET clientpfxfile =  %clientsecuritydir%\client.pfx
SET servercertfile = %serversecuritydir%\server.crt
SET serverkeyfile = %serversecuritydir%\server.key
SET servercsrfile = %serversecuritydir%\server.csr
SET serverpfxfile = %serversecuritydir%\server.pfx

CD %opensslroot%

#start x509 and ssl operations
SET OPENSSL_CONF = %opensslconffile%
SET /A vdays = 365
SET policy = policy_anything
SET keyclass = rsa:4096
SET CREATE_CSR = openssl req -nodes -new 
SET EXPORT_PFX =  openssl pkcs12 -export
SET CREATE_CERT = openssl ca -batch  


#csr create by Server and Client
(%CREATE_CSR% -newkey %keyclass% -days %vdays% -keyout %serverkeyfile% -out %servercsrfile% ) || (SET /A exitstatus = %ERRORLEVEL% && GOTO END)
(%CREATE_CSR%-newkey %keyclass% -days %days% -keyout %clientkeyfile% -out %clientcsrfile% ) || (SET /A exitstatus = %ERRORLEVEL% && GOTO END)

#crt create by CA for Server and Client
(%CREATE_CERT% -days %days% -in %servercsrfile% -out %servercertfile% -keyfile %cakeyfile% -cert %cacertfile% -policy %policy%) || (SET /A exitstatus = %ERRORLEVEL% && GOTO END)
(%CREATE_CERT% -days %days% -in %clientcsrfile% -out %clientcertfile% -keyfile %cakeyfile% -cert %cacertfile% -policy %policy%) || (SET /A exitstatus = %ERRORLEVEL% && GOTO END)

#pfx create by CA for Server and Client
(%EXPORT_PFX% -in  %servercertfile%  -inkey  %serverkeyfile% -certfile %cacertfile% -out %serverpfxfile% pass:%certaccesspass%) || (SET /A exitstatus = %ERRORLEVEL% && GOTO END)
(%EXPORT_PFX% -in %clientcertfile% -inkey %clientkeyfile% -certfile %cacertfile% -out  %clientpfxfile% pass:%certaccesspass%) || (SET /A exitstatus = %ERRORLEVEL% && GOTO END)




#copy "useful" files and remove other traces
XCOPY /V %cacertfile% %casecuritydir%\ca.cert
XCOPY /V %cakeyfile% %casecuritydir%\ca.key
CD %opensslroot%\..
RD /S /Q %opensslroot%



:END 

IF %exitstatus% != %test% 
   IF %exitstatus% >= 0 (SET /A exitstatus = -1 * %exitstatus%) 


:EXIT
DISABLEEXTENSION
EXIT /B %exitstatus%
