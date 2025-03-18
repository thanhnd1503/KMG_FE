import Cookies from 'js-cookie';

export const COOKIE_EXPIRE_TIME = 7; //Days

export const setCookie = (name: string, data: any, config: Cookies.CookieAttributes = {}) => {
  return Cookies.set(name, JSON.stringify(data), config);
};

export const removeCookie = (name: string, config: any = {}) => {
  return Cookies.remove(name, config);
};

export const getCookie = (name: string) => {
  const cookieData = Cookies.get(name) !== undefined ? Cookies.get(name) : null;
  let results;

  if (cookieData) {
    try {
      results = JSON.parse(cookieData);
    } catch (error) {
      console.error('Error when parse JSON data:', error);
    }
  } else {
    console.log('Cookie not exists or empty.');
  }

  return results;
};
