# **Welcome to the Dazzle Demo Git Repository**

*Author: Dave Krier*


This tool will allow you to build really neat Web Demo / Presentation sites so you
can deliver kick butt demos and presenations. You may share the links used in your presentation via the link to your demo or you can download a PDF file with all the links and attach it to an email. 

![alt text](https://github.com/kriersd/dazzle_demo/blob/master/public/images/markup_images/dazzle_show.png?raw=true)

## The architecture of this application 
* Docker application (Front End)

	*You may also run this as a Node.js app*

* Cloudant DB - (Datastore) 

	**Note**: You will need to have an IBM Cloud Account to host a CloudantDB
	
	
![alt text](https://github.com/kriersd/dazzle_demo/blob/master/public/images/markup_images/cloud_architecture.png?raw=true)

## Create a Cloudant Database
1. Log into IBM Public Cloud -  https://cloud.ibm.com
2. Go to the catalog 
3. Select Cloudant from the catalog
4. provision a cloudant service
5. You can name this anything you want and it's ok to accept all the defaults. The **_lite plan_** will work just fine for this app. 

**Once the service is provisioned you will need to configure your database** 

## Configure the new Database

1. Find your new service in the list of cloud foundry services. 
2. Select your service.
3. Click on service credentials.
4. Generate NEW service credentials.
5. You can view the new credentials once you generate it. 
6. Save the following information, you will need to provide this informatin to the applciation that will connect to this app. 
	* host
	* password
	* username
	* url

7. Create a new database named **dazzledb**
8. Click on the new databse. 
9. Click on the plus sign next to the **design documents**
10. Create a NEW **query index**
11. Replace the JSON in the index field with the following. 

```
		{
		   "index": {
		      "fields": [
		         "timestamp"
		      ]
		   },
		   "name": "ts-json-index",
		   "type": "json"
		}
```

*  click on **create index**

The Database is now ready!! 

###We need to get the connection information for your database. 

1. You wlll find the connection inforation in the **service account** section of your IBM CLoud Service. 
2. If you do not see a service account, you may need to generate one with role **manager** access. 
3. Once that is created, you can see the JSON for the credentials. It will look something like this!  You will need this to populate all the sensitive information in the .env file and the docker.env file. 

```
{
  "apikey": "xxxxxxxxxxxxxxxxxxxxxxxxx",
  "host": "xxxxxxxxxxxxxxxxxxx-bluemix.cloudant.com",
  "iam_apikey_description": "Auto generated apikey during resource-key operation for Instance - crn:v1:bluemix:public:cloudantnosqldb:us-south:a/xxxxxxxxxxxx:xxxxxxxxxxxxxxxxxxc::",
  "iam_apikey_name": "auto-generated-apikey-xxxx-xxxxx-xxxx-xxxxx-xxxxxx",
  "iam_role_crn": "crn:v1:bluemix:public:iam::::serviceRole:Manager",
  "iam_serviceid_crn": "crn:v1:bluemix:public:iam-identity::a/xxxxxxxxxx::serviceid:ServiceId-zzzzzzzzzzzzzzz",
  "password": "xxxxxxxxxxxxxxxxxxxx",
  "port": 443,
  "url": "https://xxxxxxxx-xxxxx:yyyyyyyyyyyyy-bluemix.cloudant.com",
  "username": "xxxxxxx-yyyyyyy-bluemix"
}
```

	
## If your running this in DOCKER

* Sensitive information is passed into this application via a Docker environment variable file. You will need to do the following. 

1. Clone this repository

2. Create a new file called **docker.env** in the root of the project folder. Look at the EXAMPLE file called: ```RENAME_THIS_TO docker.env EXAMPLE.ONLY```  Note: there are no quotes around the values in the docker.env file. 
3. Add your userid, password, db url, to the file. You will need to first create a CloudantDB in IBM Cloud Public first. 
4. build your container image

   ```
   docker build -t dazzle-app .
   ```
   
5. You will need to pass this into the your container when you issue the docker run command using the --env-file param as such: ```--env-file=./docker.env```

	```
	docker run -d -p 3000:3000 --name dazle-app --env-file ./docker.env dazzle-app
	```

	
## If your running this as a NODE.js App 

* sensitive information is passed into this application via .env environment variable file. You will need to do the following. 

1. Clone this repository

2. Create a new file called **.env** in the root of the project folder. Look at the EXAMPLE file called: ```RENAME_THIS_TO .env EXAMPLE.ONLY``` 
3. Add your userid, password, db url, to the file. You will need to first create a CloudantDB in IBM Cloud Public first. 
4. The application will pick up this file on load, so all you need to do is have this file in the root directory and it will pick it up. 

## Deploying to Kubernetes


It is assumed that you have a kubernetes environment already up and running. In my specific case, I am deploying this to OpenShift. 

1. You must first login to IBM CLoud and provision a Registry Service. 

	[IBM Registry Overview](https://cloud.ibm.com/docs/Registry?topic=Registry-registry_overview)
	
2. Follow the IBM Registry quickstart guide on how to:
    * Connect to your registry
    * Create a namespace
    * Tag your image (locally)
    * Push your image to the IBM Container Registry 

[IBM Registry Quick Start Guide](https://cloud.ibm.com/registry/start)

**Note:** I first setup my app to run locally using docker. I then pushed my docker image to the IBM Image Repository. Follow the steps to get the app running in a Docker image locally. 

###Configure the OpenShift YAML files

1.) Modifications needed for the deployment.yaml file. 
 You will first need to rename this file: 
 
 ```
 kubernetes_deployment/openshift/deployment EXAMPLE.yaml
 ```
Update the environment variables within that file. 


	
```
          env:
          - name: db_full_url
            value: https://userid:pasword@account-bluemix.cloudant.com
          - name: db_name
            value: mydbname
          - name: db_url
            value: account-bluemix.cloudant.com
          - name: db_user
            value: userid
          - name: db_password
            value: password
          - name: debug
            value: false
```

2. Deploy the YAML to your OpenShift cluster. 


**Note:** The default project within an IBM ROKS cluster is pre-configured to allow access to images that are located in the IBM Registry Services. 

You can use the oc apply command or you can deploy right from the openshift console. Deploy it in this order. 

	1. deployment.yaml
	2. service.yaml
	3. route.yaml


3. Find your Route URL in the OpenShift Console. 

	Access the site using the route URL plus this path. 
	
	```
	<route url>/listcards
	```





