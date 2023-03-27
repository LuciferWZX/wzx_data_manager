export const ipHandle = (origin: string) => {
  let ip = '';
  if (origin.indexOf('::ffff:') !== -1) {
    ip = origin.substring(7);
  }
  return ip;
};
