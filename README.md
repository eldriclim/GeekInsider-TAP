# GeekInsider-TAP

Currently deployed on [Heroku](https://limitless-cliffs-54433.herokuapp.com).

## Requirements
Node 8 or greater is required.

MySQL 5 or greater is also required.

## Setting up

To setup the environment, you have to first create a database and run [`SQL/createTable.sql`](https://github.com/eldriclim/GeekInsider-TAP/blob/master/SQL/createTable.sql) to create the tables.

The configuration file [`config/config.json`](https://github.com/eldriclim/GeekInsider-TAP/blob/master/config/config.json) has been intentionally added for your reference. Do update the values to match your local environment and add it to your `.gitignore` before running the server.

To install the dependencies and run server:
```bash
npm install
npm start
```

## Testing

You are advised to create a seperate database and update [`config/config.json`](https://github.com/eldriclim/GeekInsider-TAP/blob/master/config/config.json) for testing. Postman collection exports are located in the [`postman`](https://github.com/eldriclim/GeekInsider-TAP/blob/master/postman) directory.

To run the test suite:
```bash
npm test
```

## Deployment

Additonal endpoint have been added for deployment purposes. 

#### GET /heroku/select
* Returns all rows in `Teachers`, `Students` and `Teacher_Students` table

#### DELETE /heroku/delete
* Delete all rows in `Teachers`, `Students` and `Teacher_Students` table