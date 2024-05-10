CREATE TABLE product_variants (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id)
);

CREATE TABLE product_variant_options (
  product_variant_id INTEGER NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
  option_id INTEGER NOT NULL REFERENCES options(id),
  PRIMARY KEY (product_variant_id, option_id)
);
