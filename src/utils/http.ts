import { extend, ResponseError } from 'umi-request';

const errorHandler = (err: ResponseError) => {
  if (err?.data) {
    console.log('error', err.data);
    return err.data;
  }
  throw err; //
};
const request = extend({
  credentials: 'omit',
  timeout: 60000,
  cache: 'no-cache',
  errorHandler,
});
request.interceptors.request.use((url, options) => {
  const header: any = options.headers;
  const token = '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';
  header.Authorization = `Bearer ${token}`;

  return {
    url: url,
    options: {
      ...options,
      headers: header,
    },
  };
});
request.interceptors.response.use(async (response, options) => {
  return response;
});
export default request;
