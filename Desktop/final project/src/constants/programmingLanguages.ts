export const PROGRAMMING_LANGUAGES = [
  'javascript', 'typescript', 'python', 'java', 'cpp', 'csharp', 'php',
  'ruby', 'go', 'rust', 'swift', 'kotlin', 'scala', 'html', 'css',
  'sql', 'bash', 'json', 'yaml', 'markdown', 'xml', 'jsx', 'tsx'
] as const

export type ProgrammingLanguage = typeof PROGRAMMING_LANGUAGES[number] 