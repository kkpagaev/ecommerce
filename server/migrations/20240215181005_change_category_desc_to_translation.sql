-- +goose Up
-- +goose StatementBegin
ALTER TABLE categories DROP COLUMN description;
ALTER TABLE categories ADD COLUMN description jsonb;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE categories DROP COLUMN description;
ALTER TABLE categories ADD COLUMN description text;
-- +goose StatementEnd
