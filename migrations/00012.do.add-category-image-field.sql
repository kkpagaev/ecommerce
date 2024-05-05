ALTER TABLE categories ADD COLUMN image uuid REFERENCES file_uploads(id);
