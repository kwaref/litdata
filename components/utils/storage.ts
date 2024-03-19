export const retrieve = (key: string) => {
  try {
    // @ts-ignore
    return JSON.parse(window.localStorage.getItem(key))
  } catch (e) {
    return ''
  }
}

export const set = (key: string, value: any) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {}
}

export const remove = (key: string) => {
  try {
    window.localStorage.removeItem(key)
  } catch (e) {}
}
