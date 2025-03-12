# NC News

NC news is a restful API for the Northcoders news application.  
The Northcoders news is a web application where users can read, search and post articles and comments.

The API is hosted at the location below.  
https://nc-news-site-kc.onrender.com/api

This will currently provide a list of public endpoints to interact with

## Installation

# Requirements

The following applications will need to be installed

* node.js <i>[minimum version v 23.5.0]</i>
* POSTGreSQL <i>[minimum version v 8.13.3]</i>

# Getting started

 * Clone the repository to your local machine by
    
    `git clone https://github.com/KChan-ka/NC_news_site.git`

 * Install relevant packages by running the command below.  

    `npm install`

# Set environment variables

The following environment variable will need to be setup

* `PGDATABASE` The PostGreSQL database name

* `DATABASE_URL` to be added to the `.env.production` file

# Development env setup

A new file `.env.development` will need to be set up.  Add the following variable to it:

`PGDATABASE=nc_news`

Please ensure that the file is added to .git.ignore

# Test env setup

A new file `.env.test` will need to be set up.  Add the following variable to it:

`PGDATABASE=nc_news_test`

Please ensure that the file is added to .git.ignore

# Production env setup

A new file `.env.production` will need to be set up.  Add the following variable to it:

`DATABASE_URL=postgresql://postgres.[USERNAME]:[PASSWORD]@aws-0-eu-west-2.pooler.supabase.com:6543/postgres`

Replace [USERNAME] and [PASSWORD] with the relevant information

Please ensure that the file is added to .git.ignore

# Generating the databases

 * In order to create the 2 new databases (dev and test), please run

    `npm run setup-dbs`

    **This will generate 2 database: nc_news and nc_news_test**

* To seed the **test** database, run the below:

    `npm run test-seed`

* To seed the **development** database, run the below:

    `npm run seed`

# Running the Application

To run the application, please run:

`npm start`

If successful, the following prompt will be shown

`Listening on 9090...`

You can try making a request by sending a GET request to 

`http://localhost:9090/api`

# Testing

The tests can be triggered by running:

`npm test`