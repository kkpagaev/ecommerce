-- +goose Up
-- +goose StatementBegin
ALTER TABLE products ALTER COLUMN category_id SET NOT NULL;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE products ALTER COLUMN category_id DROP NOT NULL;
-- +goose StatementEnd
