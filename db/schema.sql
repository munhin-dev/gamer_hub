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

INSERT INTO
    games (
        game_name,
        developer,
        game_publisher,
        year_releases,
        genre,
        descriptions,
        image_url
    )
VALUES
    (
        'Elden Ring',
        'From Software',
        'Bandai Namco Games',
        '2022-02-25',
        'Action RPG',
        'Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring and become an Elden Lord in the Lands Between.',
        'https://upload.wikimedia.org/wikipedia/en/b/b9/Elden_Ring_Box_art.jpg'
    );

INSERT INTO
    games (
        game_name,
        developer,
        game_publisher,
        year_releases,
        genre,
        descriptions,
        image_url
    )
VALUES
    (
        'Horizon Forbidden West',
        'Guerrilla',
        'PlayStation Studios',
        '2022-02-18',
        'Open-World',
        'Join Aloy as she braves the Forbidden West – a majestic but dangerous frontier that conceals mysterious new threats.',
        'https://upload.wikimedia.org/wikipedia/en/6/69/Horizon_Forbidden_West_cover_art.jpg'
    );

INSERT INTO
    games (
        game_name,
        developer,
        game_publisher,
        year_releases,
        genre,
        descriptions,
        image_url
    )
VALUES
    (
        'Gran Turismo 7',
        'Polyphony Digital',
        'PlayStation Studios',
        '2022-04-03',
        'Racing',
        'Gran Turismo ® 7 brings together the very best features of the Real Driving Simulator.',
        'https://en.wikipedia.org/wiki/Gran_Turismo_7#/media/File:Gran_Turismo_7_cover_art.jpg'
    );

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    firstname TEXT NOT NULL,
    lastname TEXT NOT NULL,
    username TEXT NOT NULL,
    password_digest TEXT NOT NULL,
    email_address TEXT NOT NULL
);

INSERT INTO
    users (
        firstname,
        lastname,
        username,
        password_digest,
        email_address
    )
VALUES
    (
        'Mun Hin',
        'Ooi',
        'obh555',
        'tmm123',
        'obh555@gmail.com'
    );

INSERT INTO
    users (
        firstname,
        lastname,
        username,
        password_digest,
        email_address
    )
VALUES
    (
        'John',
        'Smith',
        'john1923',
        '12345',
        'john_smith@gmail.com'
    );

CREATE TABLE users_games (
    user_id INT REFERENCES users (id),
    game_id INT REFERENCES games (id),
    finished BOOLEAN NOT NULL
);

INSERT INTO
    users_games (
        user_id,
        game_id,
        finished
    )
VALUES
    (1, 1, TRUE);

CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    user_id INT REFERENCES users (id),
    game_id INT REFERENCES games (id),
    created_at TIMESTAMP NOT NULL
);

INSERT INTO
    posts (
        content,
        user_id,
        game_id,
        created_at
    )
VALUES
    (
        'This is second comment',
        2,
        1,
        current_timestamp
    );

CREATE TABLE friends (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users (id),
    friend_id INT REFERENCES users (id)
);

INSERT INTO
    friends (user_id, friend_id)
VALUES
    (1, 2);

CREATE TABLE friend_request (
    id SERIAL PRIMARY KEY,
    user_id INT ,
    friend_id INT
);

INSERT INTO
    friend_reqeust (user_id, friend_id)
VALUES
    (1, 2);

SELECT
    *
FROM
    games
    INNER JOIN users_games ON games.id = users_games.game_id
    INNER JOIN friend_reqeust ON users_games.user_id = friend_reqeust.user_id
    INNER JOIN friends ON friend_reqeust.user_id = friends.user_id
WHERE
    users_games.user_id = 1;


INSERT INTO
    games (
        game_name,
        developer,
        game_publisher,
        year_releases,
        genre,
        descriptions,
        image_url
    )
VALUES
    (
        'Resident Evil Village',
        'Capcom',
        'Capcom',
        '2021-05-07',
        'Survival',
        'Set a few years after the horrifying events in the critically acclaimed Resident Evil 7: Biohazard, the all-new storyline begins with Ethan Winters and his wife Mia living peacefully in a new location, free from their past nightmares. ',
        'https://www.mobygames.com/images/covers/l/736988-resident-evil-village-playstation-4-front-cover.jpg'
    );

INSERT INTO
    games (
        game_name,
        developer,
        game_publisher,
        year_releases,
        genre,
        descriptions,
        image_url
    )
VALUES
    (
        'Demon''s Souls',
        'Bluepoint Games',
        'Sony Interactive Entertainment',
        '2020-11-11',
        'Action RPG',
        'Entirely rebuilt from the ground up, this remake invites you to experience the unsettling story and ruthless combat of Demon''s Souls™.',
        'https://www.mobygames.com/images/covers/l/696239-demon-s-souls-playstation-5-front-cover.jpg.'
    );

INSERT INTO
    games (
        game_name,
        developer,
        game_publisher,
        year_releases,
        genre,
        descriptions,
        image_url
    )
VALUES
    (
        'Genshin Impact',
        'miHoYo',
        'miHoYo',
        '2020-11-11',
        'Action RPG',
        'Step into Teyvat, a vast world teeming with life and flowing with elemental energy.',
        'https://www.mobygames.com/images/covers/l/686749-genshin-impact-playstation-4-front-cover.jpg'
    );

INSERT INTO
    games (
        game_name,
        developer,
        game_publisher,
        year_releases,
        genre,
        descriptions,
        image_url
    )
VALUES
    (
        'Red Dead Redemption 2',
        'Rockstar Games',
        'Rockstar Games',
        '2018-10-26',
        'Open-World',
        'America, 1899. The end of the wild west era has begun as lawmen hunt down the last remaining outlaw gangs. Those who will not surrender or succumb are killed.',
        'https://www.mobygames.com/images/covers/l/517698-red-dead-redemption-ii-playstation-4-front-cover.png'
    );


INSERT INTO
    games (
        game_name,
        developer,
        game_publisher,
        year_releases,
        genre,
        descriptions,
        image_url
    )
VALUES
    (
        'Fallout 4',
        'Bethesda Game Studios',
        'Bethesda Softworks',
        '2015-11-10',
        'Western-Style',
        'Fallout 4 is the studio''s most ambitious game ever and the next generation of open-world gaming. As the sole survivor of Vault 111, you enter a world destroyed by nuclear war. Only you can rebuild and determine the fate of the Wasteland. Welcome home.',
        'https://www.mobygames.com/images/covers/l/317272-fallout-4-playstation-4-front-cover.jpg'
    );

INSERT INTO
    games (
        game_name,
        developer,
        game_publisher,
        year_releases,
        genre,
        descriptions,
        image_url
    )
VALUES
    (
        'The Witcher 3: Wild Hunt',
        'CD Projekt Red Studio',
        'Warner Bros. Interactive Entertainment',
        '2015-05-19',
        'Action RPG',
        'Become a monster slayer for hire and embark on an epic journey to track down the child of prophecy, a living weapon capable of untold destruction.',
        'hhttps://www.mobygames.com/images/covers/l/305108-the-witcher-3-wild-hunt-playstation-4-front-cover.jpg'
    );

INSERT INTO
    games (
        game_name,
        developer,
        game_publisher,
        year_releases,
        genre,
        descriptions,
        image_url
    )
VALUES
    (
        'Persona 5',
        'Atlus',
        'Atlus',
        '2016-09-15',
        'Japanese-Style',
        'Uncover the picaresque story of a young team of phantom thieves in this latest addition to the critically acclaimed Persona series.',
        'https://www.mobygames.com/images/covers/l/390017-persona-5-playstation-3-front-cover.png'
    );

INSERT INTO
    games (
        game_name,
        developer,
        game_publisher,
        year_releases,
        genre,
        descriptions,
        image_url
    )
VALUES
    (
        'Monster Hunter: World',
        'Capcom',
        'Capcom',
        '2018-01-26',
        'Action RPG',
        'In Monster Hunter: World, the latest installment in the series, you can enjoy the ultimate hunting experience, using everything at your disposal to hunt monsters in a new world teeming with surprises and excitement.',
        'https://www.mobygames.com/images/covers/l/452375-monster-hunter-world-playstation-4-front-cover.png'
    );

INSERT INTO
    games (
        game_name,
        developer,
        game_publisher,
        year_releases,
        genre,
        descriptions,
        image_url
    )
VALUES
    (
        'Bloodborne',
        'From Software',
        'From Software',
        '2015-03-24',
        'Action RPG',
        'Hunt your nightmares as you search for answers in the ancient city of Yharnam, now cursed with a strange endemic illness spreading through the streets like wildfire.',
        'https://www.mobygames.com/images/covers/l/302471-bloodborne-playstation-4-front-cover.jpg'
    );

INSERT INTO
    games (
        game_name,
        developer,
        game_publisher,
        year_releases,
        genre,
        descriptions,
        image_url
    )
VALUES
    (
        'Street Fighter V',
        'Capcom',
        'Capcom',
        '2016-02-16',
        'Fighting',
        'Street Fighter V is a 2.5D fighting game and the fifth installment from the long-running Street Fighter series.',
        'https://www.mobygames.com/images/covers/l/384417-street-fighter-v-playstation-4-front-cover.jpg'
    );

INSERT INTO
    games (
        game_name,
        developer,
        game_publisher,
        year_releases,
        genre,
        descriptions,
        image_url
    )
VALUES
    (
        'The Legend of Zelda: Breath of the Wild',
        'Nintendo',
        'Nintendo',
        '2017-03-03',
        'Open-World',
        'Step into a world of discovery, exploration, and adventure in The Legend of Zelda: Breath of the Wild, a boundary-breaking new game in the acclaimed series.',
        'https://www.mobygames.com/images/covers/l/562559-the-legend-of-zelda-breath-of-the-wild-nintendo-switch-front-cover.jpg'
    );
