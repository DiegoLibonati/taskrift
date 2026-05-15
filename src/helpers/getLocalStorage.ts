export const getLocalStorage = (key: string): unknown => {
  const item = localStorage.getItem(key);

  if (!item) return null;

  try {
    return JSON.parse(item) as unknown;
  } catch {
    return null;
  }
};
