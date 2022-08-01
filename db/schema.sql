CREATE DATABASE gamer_hub;

CREATE TABLE games (
    id SERIAL PRIMARY KEY,
    game_name TEXT NOT NULL,
    developer TEXT NOT NULL,
    game_publisher TEXT NOT NULL,
    year_releases DATE NOT NULL,
    genre TEXT NOT NULL,
    descriptions TEXT NOT NULL,
    image_url TEXT NOT NULL
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    firstname TEXT NOT NULL,
    lastname TEXT NOT NULL,
    username TEXT NOT NULL,
    password_digest TEXT NOT NULL,
    email_address TEXT NOT NULL
);

CREATE TABLE users_games (
    user_id INT REFERENCES users (id),
    game_id INT REFERENCES games (id),
    finished BOOLEAN NOT NULL
);

CREATE TABLE posts (
    content TEXT NOT NULL,
    user_id INT REFERENCES users (id),
    game_id INT REFERENCES games (id),
    created_at TIMESTAMP NOT NULL
);

CREATE TABLE friends (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users (id),
    friend_id INT REFERENCES users (id)
);

CREATE TABLE friend_request (
    id SERIAL PRIMARY KEY,
    user_id INT,
    friend_id INT
);

