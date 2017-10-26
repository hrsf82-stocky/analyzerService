DROP DATABASE IF EXISTS stocky;

CREATE DATABASE stocky;

USE stocky;

CREATE TABLE users (
  id int NOT NULL AUTO_INCREMENT,
  user int NOT NULL,
  totalSessions int NOT NULL,
  PRIMARY KEY (ID)
);

CREATE TABLE indicators (
    id int NOT NULL AUTO_INCREMENT,
    user_id int NOT NULL,
    indicator varchar(100) NOT NULL,
    totalViews int NOT NULL, 
    average int NOT NULL, 
    PRIMARY KEY (ID)
);

CREATE TABLE profits (
    id int NOT NULL AUTO_INCREMENT,
    user_id int NOT NULL,
    currencyPair varchar(100) NOT NULL,
    profitNumber int NOT NULL,
    PRIMARY KEY (ID)
);