DROP TABLE IF EXISTS SCORES;
CREATE TABLE SCORES (
    id SERIAL PRIMARY KEY,
    quoteID int not Null,
    userID varchar(255) not Null,
    score int
    );

DROP TABLE IF EXISTS COOKIES;
CREATE TABLE COOKIES (
    userID varchar(255) PRIMARY KEY
);