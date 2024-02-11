/* @name ListCategoriesCountQuery */
SELECT COUNT(*) FROM categories;
/* @name ListCategoriesQuery */
SELECT id, name, slug, description
FROM categories
ORDER BY id
LIMIT COALESCE(:limit, 10)
OFFSET (COALESCE(:page, 1) - 1) * COALESCE(:limit, 10);
/* @name FindCategoryByIdQuery */
SELECT id, name, slug, description FROM categories
WHERE id = :id;
/* @name CreateCategoryQuery */
INSERT INTO categories
  (name, slug, description)
VALUES
  (:name, :slug, :description)
RETURNING id;
/* @name UpdateCategoryQuery */
UPDATE categories
SET
  name = COALESCE(:name, name),
  slug = COALESCE(:slug, slug),
  description = COALESCE(:description, description)
WHERE
  id = :id;
