require('dotenv').config();
const { parse } = require('pg-connection-string');

const testConfig = parse(process.env.TEST_DATABASE_URL || '');

module.exports = {
  development: {
    dialect: 'postgres',
    url: process.env.DATABASE_URL,
  },
  test: {
    dialect: 'postgres',
    database: testConfig.database || 'taskmanager_test', // Extract database name
    username: testConfig.user || 'postgres', // Extract username
    password: testConfig.password || 'database', // Extract password
    host: testConfig.host || 'localhost', // Extract host
    port: testConfig.port || 5432, // Default PostgreSQL port
    logging: false, // Disable logs in test mode
  },
};
