export const getDM = (): string => {
  const min = 100000;
  const max = 99999999999;
  return (Math.floor(Math.random() * (max - min)) + min).toString();
};
