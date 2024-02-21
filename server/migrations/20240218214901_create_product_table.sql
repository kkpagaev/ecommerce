-- +goose Up
-- +goose StatementBegin
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  name jsonb NOT NULL,
  description jsonb,
  slug VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE product_options (
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  option_value_id INTEGER REFERENCES option_values(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, option_value_id)
);

CREATE TABLE product_attributes (
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  attribute_value_id INTEGER REFERENCES attribute_values(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, attribute_value_id)
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE product_attributes;
DROP TABLE product_options;
DROP TABLE products;
-- +goose StatementEnd
