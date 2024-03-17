CREATE TABLE IF NOT EXISTS stocks (
  product_id INTEGER NOT NULL REFERENCES products(id),
  option_id  INTEGER NOT NULL REFERENCES options(id),
  location_id INTEGER NOT NULL REFERENCES locations(id),
  count INTEGER NOT NULL,
  PRIMARY KEY (product_id, option_id, location_id)
);
