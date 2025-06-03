# NC News Seeding

# Setting up development Environment:

- in the root directory of this repo, create a file named .env.development
- within this file, add

PGDATABASE=nc_news

# Setting up test Environment

- in the root directory of this repo, create a file named .env.test
- within this file, add

PGDATABASE=nc_news_test

# Setting up and seeding the database after defining our environments

1. make sure you have all dependencies installed ('npm install' in terminal)
2. 'npm run setup-dbs' to set up the dev and test environment databases
3. 'npm run test-seed' to run tests (and confirm you are connected to the database in a test environment)
4. 'npm run seed-dev' to seed your development database

# queries.js

queries.js contains some sample functions for querying different data, to try them, remove their invocation (eg: viewAllUsers() ) from the commented block at the bottom of the file

# Entity Relationship Diagram

![ERD](./ERD.png)
