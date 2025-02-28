# Getting started

1. To ensure packages are installed run
    "npm install"

2. In order to create the 2 new databases, please run
    "npm run setup-dbs"

    **This will generate 2 databases: nc_news and nc_news_test**

3. Set up .env files and point them to the correct test and development databases respectively

    Create a new file ".env.test" and add "PGDATABASE=nc_news_test"
    Create a new file ".env.development" and add "PGDATABASE=nc_news"

    Ensure, these files are added to .gitignore by adding .env.*


# Verify the set up

1. To ensure that all tables and databases are correctly set up, please trigger the following tests

    "npm run test-seed"

    **These tests will pass once all the tables are created with the correct data**

2. To check connection to dev database, please run the command below

    "npm run seed-dev"

    **This will confirm connectivity to the dev database**