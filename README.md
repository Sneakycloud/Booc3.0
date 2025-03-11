# Booc
This is an app where you can create and schedule meetings and events. Don't miss any events by following people and get a notice when someone uploads a new event. Keep track of everything on your personal page. In this fork we will continue developing the application and make it Scalable and Fault Tolerant.

Group 7 - List of members
---------
* ebbabrage - Ebba Brage
* sandzan - Sandra Carlsson
* sneakycloud - Eddie Olofsgård

Tools
----------
[Material UI Components](https://mui.com/material-ui/all-components)

# Setup project on Azure:
1. In the terraform folder, run following:
    - ```terraform init```
    - ```terraform apply -auto-approve```
    - ```terraform output```
    - ^get the APP_NAME from above
2. Replace {APP_NAME} with the result from above, if unchanged use BoocApp
4. Log in to azure cli
5. Place the following in github secrets as
    - If you already have set up this once then only CONTAINER_REGISTRY_PASSWORD needs to be updated
    - Secret name = result of running command in cmd
    - CONTAINER_REGISTRY_LOGIN_SERVER = az acr show -n {APP_NAME} --query loginServer -o tsv
    - CONTAINER_REGISTRY_USERNAME = az acr credential show -n {APP_NAME} --query username -o tsv
    - CONTAINER_REGISTRY_PASSWORD = az acr credential show -n {APP_NAME} --query passwords[0].value -o tsv
    - DB_USERNAME = username for a acount to mongodb uri
    - DB_PASSWORD = a password for a account to a mongodb uri
    - SESSION_SECRET = a secret to be used (write whatever you want here)
    - PRODUCTION_ENV = true
7. In your kubectl folder, do following:
    - ```az aks get-credentials --name BoocApp --resource-group BoocApp```
    - Make copy of config and name it config.bak
    - base64 encode the config (for ex using: https://www.di-mgt.com.au/base64-for-windows.html)
    - Add the following to github secrets
        - KUBE_CONFIG = (content of base64 encoded config file)
8. Anywhere
    - Run all github workflows
    - REACT_APP_BACKEND_IP = kubectl get service backend
    - Run frontend workflow after adding the new secret
    - ^place external ip from above in frontend axios template and replace the destination with "http://{external_ip}:80/"
    - ^Later this will instead be the ip which you use to connect to the website in a browser

When the above has been done at least once then starting the workflows will restart that service with the new github commit.
You need to start a workflow for each microservice for the program to work

# Set up project on localhost
Starting app on client
---------
1. Clone repository.
2. Go into "frontend" folder.
3. Open cmd (in the current directory) and enter ```npm ci```. (This requires node.js)
4. Then enter ```npm start``` in cmd.

Starting server
---------
1. Clone repository
2. Go into "Backend" folder.
3. Open cmd in current directory and enter ```npm ci```. (This requires node.js)
4. Create an .env file (in the backend directory) and enter your username and password for the mongodb connection string in the format:  
    ```
    DB_USERNAME = place username here  
    DB_PASSWORD = place password here  
    SESSION_SECRET= place your session secret here
    ```
   - If you want to connect to a database other than the one setup by us, then change the following in backend:  
        - in app.js change line 49 to your connection string  (uri:)  
        - in ./model/mongodbStarter.js change line 9 and 12 to your connection string  
        - Observe that this connection string should preferably set its user with process.env.DB_USERNAME, and process.env.DB_PASSWORD to avoid leaking the connection string.  
        - The connection string also decides which database in the cluster is used to so set it to an appropriate name. (This is the /Booc? part of the connection string where booc is the database     name).  
6. For debugging run ```SET DEBUG=backend:* & npm start``` in the cmd(this has a problem with doing it in vscode) or if you are running it for production ```npm start```.

Starting microserver
---------
1. Clone repository
2. Go into "Backend/Microservices/Users" folder.
3. Open cmd in current directory
4. Run ```npm ci```
5. Run ```node usersMs.js```

<!--
Preliminary List of Features
----------
- user accounts
- create events
- join events
- security(password encryption)
- personal page with your scheduled events
- follow other users, see other users events
- reset password
- notification, user roles

Main Entities
----------
users, events, groups
-->
