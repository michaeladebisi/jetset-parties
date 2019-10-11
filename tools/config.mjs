// we setup Application Config here..

const appConfig = {
  ENV: 'dev',
  PORT: 3000,
  DOMAIN: 'localhost',
  API_PATH: '/api/',
  RUNPATH_PATH: '/api/jetset',
  DB: {
    HOST: 'localhost',
    PORT: '3306',
    USERNAME: 'root',
    PASSWORD: 'password',
    NAME: 'parties',
    PARTYTABLENAME: 'party'
  }
};

export default appConfig;
