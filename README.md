# IQ-Bot-Domain-Manager



## This Repo is Deprecated. For latest source, please use: https://bitbucket.org/aaapjprojects/iq-bot-domain-manager/src/master/






Domain Creator for Automation Anywhere IQ Bot

_Easily create a custom domain (document type) for IQ Bot. You can directly import your custom domains into IQ Bot or simply generate a domain JSON file_

## Compatibility

IQ Bot 6.5+

## Install (http)

1. Clone this repository (git clone https://github.com/brendanSapience/IQ-Bot-Domain-Manager)
2. Optional: Run the install.bat file (it will automatically install required node.js dependencies)
(the node_modules folder should already contain all required dependencies)
3. Create a folder called "encryption" in the repository
4. Modify the server_config.json file and replace https with http in "http_or_https" option
5. Run the start.bat file
6. Open your browser to http://localhost:3002

## Install (https)

1. Clone this repository (git clone https://github.com/brendanSapience/IQ-Bot-Domain-Manager)
2. Optional: Run the install.bat file (it will automatically install required node.js dependencies)
(the node_modules folder should already contain all required dependencies)
3. Create a folder called "encryption" in the repository
4. Dump your pem files in the encryption folder (cert.pem, chain.pem, privkey.pem)
5. Run the start.bat file
6. Open your browser to https://localhost:3002



