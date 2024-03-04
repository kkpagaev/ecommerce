-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS stocks (
  product_id INTEGER NOT NULL REFERENCES products(id),
  attribute_value_id INTEGER NOT NULL REFERENCES attribute_values(id),
  location_id INTEGER NOT NULL REFERENCES inventory_locations(id),
  count INTEGER NOT NULL,
  PRIMARY KEY (product_id, attribute_value_id, location_id)
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS stocks;
-- +goose StatementEnd
