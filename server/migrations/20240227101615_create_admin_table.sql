-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS admins (
  id       SERIAL PRIMARY KEY,
  name     VARCHAR(255),
  surname  VARCHAR(255),
  password VARCHAR(255) NOT NULL,
  email    VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (email)
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS admins;
-- +goose StatementEnd
