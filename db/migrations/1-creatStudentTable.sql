DROP TABLE IF EXISTS students;

CREATE TABLE students(
    rut VARCHAR (10) PRIMARY KEY,
    name VARCHAR (30),
    course VARCHAR(30),
    level INTEGER
);