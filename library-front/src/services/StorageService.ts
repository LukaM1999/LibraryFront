export const getItem = (itemName: string): string | null => {
  return localStorage.getItem(itemName)
}

export const setItem = (itemName: string, itemValue: string): void => {
  localStorage.setItem(itemName, itemValue)
}

export const removeItem = (itemName: string): void => {
  localStorage.removeItem(itemName)
}
