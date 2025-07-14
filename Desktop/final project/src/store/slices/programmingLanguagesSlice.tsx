import { createSlice } from '@reduxjs/toolkit'

const PROGRAMMING_LANGUAGES = [
  'javascript', 'typescript', 'python', 'java', 'cpp', 'csharp', 'php',
  'ruby', 'go', 'rust', 'swift', 'kotlin', 'scala', 'html', 'css',
  'sql', 'bash', 'json', 'yaml', 'markdown', 'xml', 'jsx', 'tsx'
]

interface ProgrammingLanguagesState {
  languages: string[]
}

const initialState: ProgrammingLanguagesState = {
  languages: PROGRAMMING_LANGUAGES
}

const programmingLanguagesSlice = createSlice({
  name: 'programmingLanguages',
  initialState,
  reducers: {
    addLanguage: (state, action) => {
      if (!state.languages.includes(action.payload)) {
        state.languages.push(action.payload)
      }
    },
    removeLanguage: (state, action) => {
      state.languages = state.languages.filter(lang => lang !== action.payload)
    },
    setLanguages: (state, action) => {
      state.languages = action.payload
    }
  },
})

export const { addLanguage, removeLanguage, setLanguages } = programmingLanguagesSlice.actions
export default programmingLanguagesSlice.reducer 