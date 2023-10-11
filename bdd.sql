CREATE DATABASE blog_database;

CREATE TYPE user_role AS ENUM ('admin', 'user');

CREATE TABLE users(
user_id SERIAL PRIMARY KEY,
name VARCHAR(255) NOT NULL,
email VARCHAR(255) UNIQUE NOT NULL,
password VARCHAR(255) NOT NULL,
role user_role NOT NULL DEFAULT 'user'
);

CREATE TABLE articles(
article_id SERIAL PRIMARY KEY,
title VARCHAR(255) NOT NULL,
description TEXT,
img_public_id VARCHAR(255),
content TEXT,
img VARCHAR(255),
date_of_creation TIMESTAMP WITH TIME ZONE default CURRENT_TIMESTAMP,
user_id INT REFERENCES users(user_id)
);

CREATE TABLE commentary(
commentary_id SERIAL PRIMARY KEY,
description TEXT,
date_of_creation timestamp with time zone not null default now(),
user_id INT REFERENCES users(user_id),
article_id INT REFERENCES articles(article_id)
);