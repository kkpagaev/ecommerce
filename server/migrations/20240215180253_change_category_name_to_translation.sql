-- +goose Up
-- +goose StatementBegin
ALTER TABLE categories DROP COLUMN name;
ALTER TABLE categories ADD COLUMN name jsonb;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE categories DROP COLUMN name;
ALTER TABLE categories ADD COLUMN name text;
-- +goose StatementEnd
