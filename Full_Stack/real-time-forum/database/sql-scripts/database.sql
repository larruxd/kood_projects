CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    age INTEGER,
    gender TEXT,
    first_name TEXT,
    last_name TEXT
);
CREATE TABLE IF NOT EXISTS session (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT UNIQUE,
    user_id INTEGER UNIQUE
);
CREATE TABLE IF NOT EXISTS category (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT
);
CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    user_id INTEGER,
    category_id INTEGER,
    created_at DATETIME DEFAULT (datetime('now', 'localtime'))
);
CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    post_id INTEGER,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT (datetime('now', 'localtime'))
);
CREATE TABLE IF NOT EXISTS chat (
    message_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    receiver_id INTEGER,
    dateSent TEXT,
    message TEXT,
    pending BOOLEAN DEFAULT false
);
INSERT INTO users (
        username,
        password,
        email,
        age,
        gender,
        first_name,
        last_name
    )
VALUES (
        'admin',
        '$2a$10$vTfEChzkjZMW9ixxzhXxe.EfC0DhtrrPu2jD7QrTpG3I9N.2PiPi2',
        'admin@admin.admin',
        '',
        '',
        '',
        ''
    ),
    --pw: admin
    (
        'mar',
        '$2a$10$Men8efOvO6Gx.G5KfijDnOGVnYjIUnwK3c2Cj.P5HWdkhf5PubztW',
        'mar@example.com',
        26,
        'Male',
        'Mar',
        'Kus'
    ),
    --pw: 123
    (
        'Kood',
        '$2a$10$Men8efOvO6Gx.G5KfijDnOGVnYjIUnwK3c2Cj.P5HWdkhf5PubztW',
        'kood@example.com',
        3,
        'Female',
        'Kood',
        'Johvi'
    ),
    --pw: 123
    (
        'Gandalf',
        '$2a$10$Men8efOvO6Gx.G5KfijDnOGVnYjIUnwK3c2Cj.P5HWdkhf5PubztW',
        'gandalf1@example.com',
        24000,
        'Male',
        'Gandalf',
        'Greyhame'
    );
--pw: 123
INSERT INTO posts (title, content, user_id, category_id)
VALUES (
        'Welcome!',
        'This is the first post',
        1,
        1
    );
INSERT INTO posts (title, content, user_id, category_id)
VALUES (
        'Another post!',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        1,
        2
    );
INSERT INTO comments (content, user_id, post_id)
VALUES (
        'this is a comment',
        1,
        1
    ),
    (
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        1,
        1
    );
INSERT INTO category (name)
VALUES ('Random'),
    ('Specific'),
    ('Very general');
INSERT INTO chat (
        user_id,
        receiver_id,
        dateSent,
        message
    )
VALUES (
        1,
        2,
        '2023-09-12T17:00:01.155Z',
        'message 1 user 1-2'
    ),
    (
        2,
        1,
        '2023-09-12T17:08:02.155Z',
        'message 2 user 2-1'
    ),
    (
        1,
        2,
        '2023-09-12T17:08:03.155Z',
        'message 3 user 1-2'
    ),
    (
        2,
        1,
        '2023-09-12T17:08:04.155Z',
        'message 4 user 2-1'
    ),
    (
        2,
        1,
        '2023-09-12T17:08:04.155Z',
        'message 5 user 2-1'
    ),
    (
        2,
        1,
        '2023-09-12T17:08:04.155Z',
        'message 6 user 2-1'
    ),
    (
        2,
        1,
        '2023-09-12T17:08:04.155Z',
        'message 7 user 2-1'
    ),
    (
        2,
        1,
        '2023-09-12T17:08:04.155Z',
        'message 8 user 2-1'
    ),
    (
        2,
        1,
        '2023-09-12T17:08:04.155Z',
        'message 9 user 2-1'
    ),
    (
        2,
        1,
        '2023-09-12T17:08:04.155Z',
        'message 10 user 2-1'
    ),
    (
        2,
        1,
        '2023-09-12T17:08:04.155Z',
        'message 11 user 2-1'
    ),
    (
        2,
        1,
        '2023-09-12T17:08:04.155Z',
        'message 12 user 2-1'
    ),
    (
        2,
        1,
        '2023-09-12T17:08:04.155Z',
        'message 13 user 2-1'
    ),
    (
        2,
        1,
        '2023-09-12T17:08:04.155Z',
        'message 14 user 2-1'
    ),
    (
        2,
        1,
        '2023-09-12T17:08:04.155Z',
        'message 15 user 2-1'
    ),
    (
        2,
        1,
        '2023-09-12T17:08:04.155Z',
        'message 16 user 2-1'
    ),
    (
        2,
        1,
        '2023-09-12T17:08:04.155Z',
        'message 17 user 2-1'
    ),
    (
        2,
        1,
        '2023-09-12T17:08:04.155Z',
        'message 18 user 2-1'
    ),
    (
        2,
        1,
        '2023-09-12T17:08:04.155Z',
        'message 19 user 2-1'
    ),
    (
        2,
        1,
        '2023-09-12T17:08:04.155Z',
        'message 20 user 2-1'
    ),
    (
        2,
        1,
        '2023-09-12T17:08:04.155Z',
        'message 21 user 2-1'
    ),
    (
        2,
        1,
        '2023-09-12T17:08:04.155Z',
        'message 22 user 2-1'
    ),
    (
        2,
        1,
        '2023-09-12T17:10:04.155Z',
        'message 23 user 2-1'
    ),
    (
        4,
        3,
        '2023-09-12T17:08:05.155Z',
        'message wow user 4-3'
    ),
    (
        1,
        4,
        '2023-09-12T17:09:06.155Z',
        'message yay user 1-4'
    ),
    (
        2,
        3,
        '2023-09-12T17:08:07.155Z',
        'message cool user 2-3'
    )