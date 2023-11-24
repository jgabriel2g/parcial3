CREATE TABLE IF NOT EXISTS products (
    id             INT(11) NOT NULL AUTO_INCREMENT,
    name           varchar(250) not null,
    description    varchar(250),
    price          int(11) not null,
    stock          int(11) not null,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id)
);
