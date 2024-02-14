/*
  @name createTranslationQuery 
  @param translations -> ((id, locale, value)...)
*/
INSERT INTO translation (id, locale, value)
VALUES :translations
RETURNING *;
