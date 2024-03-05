-- +goose Up
-- +goose StatementBegin
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE category_descriptions (
  category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  language_id INTEGER REFERENCES languages(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE category_descriptions;
DROP TABLE categories;
-- +goose StatementEnd
