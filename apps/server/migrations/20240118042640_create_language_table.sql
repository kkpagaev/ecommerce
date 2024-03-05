-- +goose Up
-- +goose StatementBegin
CREATE TABLE languages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE languages;
-- +goose StatementEnd
