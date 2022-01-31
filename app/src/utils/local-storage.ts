const basicTokenKey = 'cfwkvih_basicToken'
export const getBasicToken = () => localStorage.getItem(basicTokenKey)
export const setBasicToken = (token: string) => localStorage.setItem(basicTokenKey, token)
export const removeBasicToken = () => localStorage.removeItem(basicTokenKey)
