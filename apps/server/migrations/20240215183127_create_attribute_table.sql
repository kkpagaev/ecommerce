-- +goose Up
-- +goose StatementBegin
CREATE TABLE attribute_groups (
  id SERIAL PRIMARY KEY,
  sort_order INTEGER NOT NULL
);

CREATE TABLE attribute_group_descriptions (
  attribute_group_id INTEGER REFERENCES attribute_groups(id) ON DELETE CASCADE,
  language_id INTEGER REFERENCES languages(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT
);

CREATE TABLE attributes (
  id SERIAL PRIMARY KEY,
  attribute_group_id INTEGER REFERENCES attribute_groups(id) ON DELETE CASCADE
);

CREATE TABLE attribute_descriptions (
  attribute_id INTEGER REFERENCES attributes(id) ON DELETE CASCADE,
  language_id INTEGER REFERENCES languages(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE attribute_descriptions;
DROP TABLE attributes;
DROP TABLE attribute_group_descriptions;
-- +goose StatementEnd
