CREATE TABLE attribute_groups (
  id SERIAL PRIMARY KEY,
  sort_order INTEGER NOT NULL
);

CREATE TABLE attribute_group_descriptions (
  attribute_group_id INTEGER NOT NULL REFERENCES attribute_groups(id) ON DELETE CASCADE,
  language_id INTEGER NOT NULL REFERENCES languages(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  PRIMARY KEY (attribute_group_id, language_id)
);

CREATE TABLE attributes (
  id SERIAL PRIMARY KEY,
  attribute_group_id INTEGER NOT NULL REFERENCES attribute_groups(id) ON DELETE CASCADE
);

CREATE TABLE attribute_descriptions (
  attribute_id INTEGER NOT NULL REFERENCES attributes(id) ON DELETE CASCADE,
  language_id INTEGER NOT NULL REFERENCES languages(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  PRIMARY KEY (attribute_id, language_id)
);
