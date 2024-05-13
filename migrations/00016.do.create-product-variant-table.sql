CREATE TYPE product_variant_stock_status AS ENUM ('in_stock', 'out_of_stock', 'preorder');

CREATE TABLE product_variants (
  id SERIAL PRIMARY KEY,
  slug varchar(255) NOT NULL UNIQUE,
  product_id INTEGER NOT NULL REFERENCES products(id),
  stock_status product_variant_stock_status NOT NULL DEFAULT 'in_stock',
  price FLOAT NOT NULL DEFAULT 0,
  old_price FLOAT NOT NULL DEFAULT 0,
  article varchar(255) NOT NULL,
  discount FLOAT DEFAULT 0.0 NOT NULL,
  popularity INT DEFAULT 0 NOT NULL,
  images jsonb DEFAULT '[]'::jsonb NOT NULL,
  barcode varchar(255) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE product_variant_options (
  product_variant_id INTEGER NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
  option_id INTEGER NOT NULL REFERENCES options(id),
  PRIMARY KEY (product_variant_id, option_id)
);
