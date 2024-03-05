-- +goose Up
-- +goose StatementBegin
CREATE TABLE locations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE locations;
-- +goose StatementEnd
