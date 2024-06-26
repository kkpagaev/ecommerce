CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) NOT NULL,
  parent_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE category_descriptions (
  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  language_id INTEGER NOT NULL REFERENCES languages(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  PRIMARY KEY (category_id, language_id)
);
