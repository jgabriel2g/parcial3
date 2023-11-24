CREATE TABLE IF NOT EXISTS sales (
    id              INT(11) NOT NULL AUTO_INCREMENT,
    product_id      INT NOT NULL,
    client_name     VARCHAR(150),
    client_phone    VARCHAR(150),
    amount          int,
    price           int,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);
