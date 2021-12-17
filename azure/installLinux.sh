#Mongo
curl https://repo.mongodb.org/apt/ubuntu/dists/focal/mongodb-org/5.0/multiverse/binary-amd64/mongodb-org-server_5.0.5_amd64.deb -o mongo.deb
sudo dpkg -i ./mongo.deb

# NodeJS
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

#System
#TODO figure out how to authenticate
git clone https://github.com/thetisch21/2022-scouting-system