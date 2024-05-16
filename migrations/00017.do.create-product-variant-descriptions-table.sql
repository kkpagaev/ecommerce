CREATE TABLE product_variant_descriptions (
  product_variant_id INTEGER NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
  language_id INTEGER NOT NULL REFERENCES languages(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  short_description TEXT,
  PRIMARY KEY (product_variant_id, language_id)
);
