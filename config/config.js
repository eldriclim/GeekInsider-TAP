const config = require('./config.json');

const env = process.env.NODE_ENV || 'development';

if (env === 'development' || 'test') {
  const configKeys = config[env];

  Object.keys(configKeys).forEach((key) => {
    process.env[key] = configKeys[key];
  });
}
