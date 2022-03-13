DROP TABLE IF EXISTS SCORES;
CREATE TABLE SCORES (
    quoteID int not Null,
    userID varchar(255) not Null,
    score int,
    PRIMARY KEY (quoteID, userID)
);

DROP TABLE IF EXISTS COOKIES;
CREATE TABLE COOKIES (
    userID varchar(255) PRIMARY KEY
);