const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const common = {
  dialect: 'postgres',
  logging: false,
  migrationStorageTableName: 'sequelize_meta',
  seederStorage: 'sequelize',
};

function buildConfig() {
  const url = process.env.DATABASE_URL;
  if (url && url.length > 0) {
    return { ...common, url, use_env_variable: 'DATABASE_URL' };
  }
  return {
    ...common,
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 5432),
    database: process.env.DB_NAME || 'quicksite_dev',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'postgres',
  };
}

module.exports = {
  development: buildConfig(),
  test: buildConfig(),
  production: buildConfig(),
};
