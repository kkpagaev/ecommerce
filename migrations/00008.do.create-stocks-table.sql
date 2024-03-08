CREATE TABLE IF NOT EXISTS stocks (
  product_id INTEGER NOT NULL REFERENCES products(id),
  attribute_id INTEGER NOT NULL REFERENCES attributes(id),
  location_id INTEGER NOT NULL REFERENCES locations(id),
  count INTEGER NOT NULL,
  PRIMARY KEY (product_id, attribute_id, location_id)
);
