# exit on error
set -e

if ! which node; then
  echo "Installing node and deps ..."
  apt-get update
  apt-get install -y build-essential python-software-properties
  add-apt-repository ppa:chris-lea/node.js
  apt-get update
  apt-get install -y nodejs fontconfig
fi

cd /vagrant
echo "Building the site ..."
npm cache clean
npm install

grunt_cli_version=$(
  npm ll --parseable | grep "grunt-cli@" | sed 's/.*grunt-cli@//' | sed 's/://'
)

sudo npm install -g grunt-cli@$grunt_cli_version

node node_modules/.bin/grunt stage --force
