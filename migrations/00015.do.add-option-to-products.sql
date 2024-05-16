CREATE TABLE product_option_groups (
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  option_group_id INTEGER NOT NULL REFERENCES option_groups(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, option_group_id)
);
