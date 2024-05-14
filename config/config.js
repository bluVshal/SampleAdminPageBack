const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  port: process.env.PORT,
  db: { /* details entered here is for demo, configuration of db will replace the values */
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'jq88esfx',
    database: process.env.DB_NAME || 'sampleadmin'
  },
  listPerPage: process.env.LIST_PER_PAGE || 10,
};