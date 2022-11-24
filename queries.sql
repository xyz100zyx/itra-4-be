CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL ,
    second_name VARCHAR(50) NOT NULL ,
    email VARCHAR(50) NOT NULL ,
    password_hash VARCHAR(100) NOT NULL,
    register_date DATE NOT NULL,
    login_date DATE NOT NULL,
    register_time TIME NOT NULL,
    login_time TIME NOT NULL,
    status INT NOT NULL,
);
