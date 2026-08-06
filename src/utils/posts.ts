// Идентификатор поста в коллекции иногда приходит со слэшем на конце
// (зависит от того, лежит файл как `slug.mdx` или `slug/index.mdx`), а якорь
// и маршрут должны быть стабильными.
export const getPostId = (id: string) => id.replace(/\/$/, "");

export const getPostPath = (id: string) => `/posts/${getPostId(id)}`;
