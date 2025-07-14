import { store } from '../store/store'
import { addLanguage, removeLanguage, setLanguages } from '../store/slices/programmingLanguagesSlice'

// Utility functions to manage programming languages in Redux store

export const addProgrammingLanguage = (language: string) => {
  store.dispatch(addLanguage(language))
}

export const removeProgrammingLanguage = (language: string) => {
  store.dispatch(removeLanguage(language))
}

export const setProgrammingLanguages = (languages: string[]) => {
  store.dispatch(setLanguages(languages))
}

export const getProgrammingLanguages = () => {
  return store.getState().programmingLanguages.languages
}

// Example usage:
// import { addProgrammingLanguage, removeProgrammingLanguage } from '../lib/programmingLanguagesUtils'
// 
// // Add a new language
// addProgrammingLanguage('dart')
// 
// // Remove a language
// removeProgrammingLanguage('php')
// 
// // Set a completely new list
// setProgrammingLanguages(['javascript', 'typescript', 'python', 'rust']) 