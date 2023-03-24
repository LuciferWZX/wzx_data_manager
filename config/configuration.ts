const appConfig = () => ({
  app: {
    name: process.env.APP_NAME,
    port: parseInt(process.env.APP_PORT),
    prefix: process.env.APP_PREFIX,
    version: process.env.APP_VERSION,
    host: process.env.APP_HOST,
  },
  mysql: {
    type: process.env.DB_TYPE,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB,
    entities: [],
    synchronize: !!process.env.SYNCHRONIZE,
  },
  redis: {
    host: process.env.RD_HOST,
    port: parseInt(process.env.RD_PORT),
    password: process.env.RD_PASSWORD,
  },
  email: {
    host: process.env.EM_TRANSPORT_HOST,
    port: parseInt(process.env.EM_TRANSPORT_PORT),
    user: process.env.EM_TRANSPORT_AUTH_USER,
    pass: process.env.EM_TRANSPORT_AUTH_PASS,
    defaultUser: process.env.EM_DEFAULT_USER,
  },
});
export default appConfig;

export type AppConfigType = ReturnType<typeof appConfig>;
