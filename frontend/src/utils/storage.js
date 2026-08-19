const TOKEN_KEY = 'blog_platform_token';
const USER_KEY = 'blog_platform_user';
const THEME_KEY = 'blog_platform_theme';

export const getStoredToken = () => localStorage.getItem(TOKEN_KEY);
export const setStoredToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const removeStoredToken = () => localStorage.removeItem(TOKEN_KEY);

export const getStoredUser = () => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};
export const setStoredUser = (user) => localStorage.setItem(USER_KEY, JSON.stringify(user));
export const removeStoredUser = () => localStorage.removeItem(USER_KEY);

export const getStoredTheme = () => localStorage.getItem(THEME_KEY) || 'dark';
export const setStoredTheme = (theme) => localStorage.setItem(THEME_KEY, theme);
