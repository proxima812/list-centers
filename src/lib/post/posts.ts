export const getPostId = (id: string) => id.replace(/\/$/, "");

export const getPostPath = (id: string) => `/posts/${getPostId(id)}`;

export const getPostMarkdownPath = (id: string) => `/posts/${getPostId(id)}.md`;
