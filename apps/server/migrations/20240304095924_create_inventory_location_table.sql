-- +goose Up
-- +goose StatementBegin
CREATE TABLE inventory_locations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE inventory_location;
-- +goose StatementEnd
