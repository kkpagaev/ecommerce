/* @name ListCategoriesCount */
SELECT COUNT(*) FROM categories;
/* @name ListCategories */
SELECT id, name, slug, description
FROM categories
ORDER BY id
LIMIT COALESCE(:limit, 10)
OFFSET (COALESCE(:page, 1) - 1) * COALESCE(:limit, 10);
/* @name FindCategoryById */
SELECT id, name, slug, description FROM categories
WHERE id = :id;
/* @name CreateCategory */
INSERT INTO categories
  (name, slug, description)
VALUES
  (:name, :slug, :description)
RETURNING id;
