const base = (min, max) =>
  (Math.floor(Math.random() * (max - min)) + min).toString();
export const getDM = (): string => {
  const min = 100000;
  const max = 99999999999;
  return base(min, max);
};
export const getVerifyCode = (): string => {
  const min = 100000;
  const max = 999999;
  return base(min, max);
};
