DROP TABLE IF EXISTS SCORE;
CREATE TABLE SCORE (
    quoteID int not Null,
    userID varchar(255) not Null,
    score int,
    PRIMARY KEY (quoteID, userID)
);
