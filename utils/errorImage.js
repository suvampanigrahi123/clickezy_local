export const imageOnError = (e) => {
  e.target.onerror = null;
  e.target.src = '/288-164.png';
};
