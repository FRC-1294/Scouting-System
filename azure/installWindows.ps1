#REMEMBER
#Invoke-WebRequest -UseBasicParsing

#MongoDB
Invoke-WebRequest -UseBasicParsing https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-5.0.5-signed.msi -o mongodb-windows-x86_64-5.0.5-signed.msi
msiexec.exe /l*v mdbinstall.log /qn /i mongodb-windows-x86_64-5.0.5-signed.msi ADDLOCAL="ServerService"

#NodeJS
Invoke-WebRequest -UseBasicParsing https://nodejs.org/dist/v16.13.1/node-v16.13.1-x64.msi -o node-v16.13.1-x64.msi
msiexec.exe /l*v nodeinstall.log /qn /i node-v16.13.1-x64.msi ADDLOCAL=ALL

#Scouting System
git clone "https://thetisch21:$($args[0])@github.com/thetisch21/2022-scouting-system"