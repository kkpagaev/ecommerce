-- +goose Up
-- +goose StatementBegin
CREATE TYPE option_type as ENUM ('color', 'size', 'text');
CREATE TABLE option_groups (
  id SERIAL PRIMARY KEY,
  sort_order INTEGER NOT NULL,
  type option_type NOT NULL
);

CREATE TABLE option_group_descriptions (
  option_group_id INTEGER NOT NULL REFERENCES option_groups(id) ON DELETE CASCADE,
  language_id INTEGER NOT NULL REFERENCES languages(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  PRIMARY KEY (option_group_id, language_id)
);

CREATE TABLE options (
  id SERIAL PRIMARY KEY,
  value jsonb NOT NULL,
  option_group_id INTEGER NOT NULL REFERENCES option_groups(id) ON DELETE CASCADE
);

CREATE TABLE option_descriptions (
  option_id INTEGER NOT NULL REFERENCES options(id) ON DELETE CASCADE,
  language_id INTEGER NOT NULL REFERENCES languages(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  PRIMARY KEY (option_id, language_id)
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE option_descriptions;
DROP TABLE options;
DROP TABLE option_group_descriptions;
DROP TABLE option_groups;
DROP TYPE option_type;
-- +goose StatementEnd
