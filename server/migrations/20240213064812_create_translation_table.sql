-- +goose Up
-- +goose StatementBegin
CREATE TYPE Locale AS ENUM ('en', 'uk', 'ru');
CREATE TABLE IF NOT EXISTS translation (
  id UUID NOT NULL,
  locale Locale NOT NULL,
  value TEXT NOT NULL,
  PRIMARY KEY(id, locale)
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS translation;
DROP TYPE IF EXISTS Locale;
-- +goose StatementEnd
