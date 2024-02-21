-- +goose Up
-- +goose StatementBegin
CREATE TABLE attributes (
  id SERIAL PRIMARY KEY,
  name jsonb NOT NULL,
  description jsonb
);

CREATE TABLE attribute_values (
  id SERIAL PRIMARY KEY,
  attribute_id INTEGER REFERENCES attributes(id) ON DELETE CASCADE,
  value jsonb NOT NULL
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE attribute_values;
DROP TABLE attributes;
-- +goose StatementEnd
