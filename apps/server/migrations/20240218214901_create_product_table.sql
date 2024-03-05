-- +goose Up
-- +goose StatementBegin
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  slug VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE product_descriptions (
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  language_id INTEGER REFERENCES languages(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT
);

CREATE TABLE product_attributes (
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  attribute_id INTEGER REFERENCES attributes(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, attribute_id)
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE product_attributes;
DROP TABLE product_descriptions;
DROP TABLE products;
-- +goose StatementEnd
