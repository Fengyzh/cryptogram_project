#!/bin/bash

set -e

echo -e 'DROP DATABASE IF EXISTS cstest; CREATE DATABASE cstest; 
      \c cstest;
' | psql --username postgres

echo "Database created successfully, reconnecting for table creation, please re-enter your password"

echo -e '
     DROP TABLE IF EXISTS scores;
      CREATE TABLE scores (
        quoteID int,
        userID varchar(25),
        score int,
        PRIMARY KEY (quoteID, userID)
    );
' | psql --username postgres --dbname cstest

echo "Database setup complete"



#psql --username postgres -c 'CREATE DATABASE cstest;'
#psql --username postgres -c '\c cstest'
#psql -c "exit"
