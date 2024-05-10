CREATE TABLE IF NOT EXISTS stocks (
  product_variant_id INTEGER REFERENCES products(id),
  location_id INTEGER REFERENCES locations(id),
  count INTEGER NOT NULL,
  PRIMARY KEY (product_variant_id, location_id)
);
