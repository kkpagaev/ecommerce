-- +goose Up
-- +goose StatementBegin
CREATE TYPE attribute_type AS ENUM ('string', 'number', 'boolean', 'date', 'list');

CREATE TABLE attributes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type attribute_type NOT NULL,
  description VARCHAR(255)
);

CREATE TABLE attribute_string_values (
  attribute_id INTEGER REFERENCES attributes(id) ON DELETE CASCADE,
  value VARCHAR(255) NOT NULL,
  PRIMARY KEY (attribute_id, value)
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE attribute_string_values;
DROP TABLE attributes;
DROP TYPE attribute_type;
-- +goose StatementEnd
