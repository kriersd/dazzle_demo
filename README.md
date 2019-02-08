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

You are now ready to go!!!

	
## If your running this in DOCKER

* Sensitive information is passed into this application via a Docker environment variable file. You will need to do the following. 

1. Clone this repository

2. Create a new file called **docker.env** in the root of the project folder. Look at the EXAMPLE file called: ```RENAME_THIS_TO docker.env EXAMPLE.ONLY``` 
3. Add your userid, password, db url, to the file. You will need to first create a CloudantDB in IBM Cloud Public first. 
4. You will need to pass this into the your container using the --env-file param as such: ```--env-file=./docker.env```

	
## If your running this as a NODE.js App 

* sensitive information is passed into this application via .env environment variable file. You will need to do the following. 

1. Clone this repository

2. Create a new file called **.env** in the root of the project folder. Look at the EXAMPLE file called: ```RENAME_THIS_TO .env EXAMPLE.ONLY``` 
3. Add your userid, password, db url, to the file. You will need to first create a CloudantDB in IBM Cloud Public first. 
4. The application will pick up this file on load, so all you need to do is have this file in the root directory and it will pick it up. 

## Deploying to Kubernetes


It is assumed that you have a kubernetes environment already up and running. In my specific case, I am deploying this to IBM Cloud Private. 

1. You must first login and define a Image Pull Policy. To do that you need to log into your ICP admin console. Click on the ```Manage``` menu item. Then select ```Resource Security``` and ```Image Policies```. 

2. Create a new image pull policy with the following settings. 
	* Name your policy (Can be anything you want)
	* Scope: namespace
	* Pick your deployment namespace. 
	* Add your repo url. Because I hosted my container in docker hub I used this format ```docker.io/<DockerAccount>/* ```
	* Save your policy. 

	*I used a rather general policy that will allow me to deploy anything from my docker hub account. You may want to be more specific to what you allow. That's up to you.*
	
3. Edit the kubernetes deployment yaml file to map to your repo. I included an EXAMPLE, but you will need to modify it. 
	* The example yaml file is located in the ```kubernetes_deployment``` folder. 
	* Modify the namespace (located in two places) 
	* Modify the image location and tag name (all one line) 
	* Modify the values for the env prams (db_name, db_full_url, db_userid, db_password, debug) 

4. To deploy the application, you will need to issue a kubectl create command like such. 

	*Note: You must fully qualify the path to the yaml or be in the current directory to do the deployment.*

```
kubectl create -f kubernetes_deployment.yaml
```




