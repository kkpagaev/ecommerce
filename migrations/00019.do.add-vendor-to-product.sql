ALTER TABLE products ADD COLUMN vendor_id INTEGER NOT NULL DEFAULT 1 REFERENCES vendors(id);
