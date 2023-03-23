type ConfigType = {
  app: {
    name: string;
    port: number;
    prefix: string;
    host: string;
  };
  mysql: {
    type: string;
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    entities: string[];
    synchronize: boolean;
  };
};
const appConfig = (): ConfigType => ({
  app: {
    name: process.env.APP_NAME,
    port: parseInt(process.env.APP_PORT),
    prefix: process.env.APP_PREFIX,
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
});
export default appConfig;

export type AppConfigType = ReturnType<typeof appConfig>;
