-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS prices (
  product_id BIGINT,
  price NUMERIC(10, 2),
  type VARCHAR(255) DEFAULT 'default',
  PRIMARY KEY (product_id, type)
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS prices;
-- +goose StatementEnd
