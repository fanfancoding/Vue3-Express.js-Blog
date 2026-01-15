export const responseTypeMap = new Map([
  ['json', 'application/json'],
  ['blob', 'blob'],
  ['formData', 'application/x-www-form-urlencoded'],
  ['text', 'text/plain'],
  ['stream', 'text/event-stream'],
  ['arrayBuffer', 'application/octet-stream'],
])

export const CATEGORY_TYPE = {
  ARTICLE: 'article',
  ESSAY: 'essay',
  ALL: 'all',
}
