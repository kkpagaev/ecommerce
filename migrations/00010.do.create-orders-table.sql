CREATE TYPE order_status as ENUM ('created', 'processing', 'shipped', 'cancelled');

CREATE TABLE IF NOT EXISTS orders (
  id          SERIAL PRIMARY KEY,
  status      order_status NOT NULL DEFAULT 'created',
  price       NUMERIC(10, 2),
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
  id         SERIAL PRIMARY KEY,
  order_id   BIGINT NOT NULL REFERENCES orders(id),
  product_id INTEGER NOT NULL REFERENCES products(id),
  option_id  INTEGER NOT NULL REFERENCES options(id),
  price      BIGINT NOT NULL,
  quantity   BIGINT NOT NULL
);

CREATE TABLE IF NOT EXISTS order_history (
  id         SERIAL PRIMARY KEY,
  order_id   BIGINT NOT NULL REFERENCES orders(id),
  status     order_status NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
