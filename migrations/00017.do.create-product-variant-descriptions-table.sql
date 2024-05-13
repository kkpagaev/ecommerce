CREATE TABLE product_variant_descriptions (
  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  language_id INTEGER NOT NULL REFERENCES languages(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  short_description TEXT,
  PRIMARY KEY (category_id, language_id)
);
