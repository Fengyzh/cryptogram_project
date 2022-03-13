#!/bin/bash

echo "Please enter your postgres password: "
read -s password
psql -f createDB.sql "user=postgres password=$password" 
echo "Database created successfully, reconnecting for table creation."
psql -f createTable.sql "user=postgres password=$password dbname=cs375db"
echo "Table successfully has been setup."