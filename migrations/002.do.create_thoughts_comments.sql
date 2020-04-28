CREATE TABLE music_thoughts_comments (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    thought_text TEXT NOT NULL,
    date_created TIMESTAMP DEFAULT now() NOT NULL,
    thought_id INTEGER 
        REFERENCES music_thoughts(id) ON DELETE CASCADE NOT NULL
);