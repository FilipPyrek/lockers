create table users (
	id SERIAL NOT NULL PRIMARY KEY,
	email VARCHAR(64) NOT NULL UNIQUE,
	password CHAR(64) NOT NULL
);
