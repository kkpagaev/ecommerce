ALTER TABLE products ADD COLUMN option_group_id INTEGER REFERENCES option_groups(id) ON DELETE SET NULL;

CREATE TABLE product_options (
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  option_id INTEGER NOT NULL REFERENCES options(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, option_id)
)
