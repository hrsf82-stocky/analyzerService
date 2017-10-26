
    DROP TABLE IF EXISTS MyUsers;

    DROP SEQUENCE IF EXISTS MyUsers_seq;
    CREATE SEQUENCE MyUsers_seq;

    CREATE TABLE MyUsers
    (
        id INTEGER NOT NULL DEFAULT NEXTVAL ('MyUsers_seq'),
        user_id INTEGER NOT NULL,
        totalSessions INTEGER NOT NULL,
        PRIMARY KEY (id)
    );


    DROP TABLE IF EXISTS Indicators;

    DROP SEQUENCE IF EXISTS Indicators_seq;
    CREATE SEQUENCE Indicators_seq;

    CREATE TABLE Indicators
    (
        id INTEGER NOT NULL DEFAULT NEXTVAL ('Indicators_seq'),
        user_id INTEGER NOT NULL,
        indicator varchar(100) NOT NULL,
        totalViews INTEGER NOT NULL,
        average FLOAT NOT NULL,
        PRIMARY KEY (id)
    );

    DROP TABLE IF EXISTS Profits;

    DROP SEQUENCE IF EXISTS Profits_seq;
    CREATE SEQUENCE Profits_seq;

    CREATE TABLE Profits
    (
        id INTEGER NOT NULL DEFAULT NEXTVAL ('Profits_seq'),
        user_id INTEGER NOT NULL,
        currencyPair varchar(100) NOT NULL,
        profitNumber FLOAT NOT NULL,
        PRIMARY KEY (id)
    );
