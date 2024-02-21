-- +goose Up
-- +goose StatementBegin
CREATE TABLE options (
  id SERIAL PRIMARY KEY,
  name jsonb NOT NULL
);

CREATE TABLE option_values (
  id SERIAL PRIMARY KEY,
  option_id INTEGER REFERENCES options(id) ON DELETE CASCADE,
  value jsonb NOT NULL
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE option_values;
DROP TABLE options;
-- +goose StatementEnd
