/* @name ListCategories */
SELECT id, name, slug, description FROM categories
ORDER BY id;
/* @name FindCategoryById */
SELECT id, name, slug, description FROM categories
WHERE id = :id;
/* @name CreateCategory */
INSERT INTO categories
  (name, slug, description)
VALUES
  (:name, :slug, :description)
RETURNING id;
