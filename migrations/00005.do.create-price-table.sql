CREATE TABLE IF NOT EXISTS prices (
  product_id BIGINT,
  price NUMERIC(10, 2),
  type VARCHAR(255) DEFAULT 'default',
  PRIMARY KEY (product_id, type)
);
