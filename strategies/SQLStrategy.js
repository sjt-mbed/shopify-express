const Knex = require('knex');

const {
  SQL_HOST,
  SQL_USER,
  SQL_PASS,
  SQL_DB,
  NODE_ENV,
} = process.env;

const isDevelopment = NODE_ENV !== 'production';
if(isDevelopment) {
	const defaultConfig = {
	  dialect: 'sqlite3',
	  useNullAsDefault: true,
	  connection: {
		filename: './db.sqlite3',
	  },
	};
} else {
	const defaultConfig = {
		client: 'mysql',
		connection: {
			host: SQL_HOST,
			user: SQL_USER,
			password: SQL_PASS,
			database: SQL_DB
		}
	}
}

module.exports = class SQLStrategy {
	if(!isDevelopment){
		console.log('Add one of knex supported packages using npm install and remove this logging');
	}
  constructor(config = defaultConfig) {
    this.knex = Knex(config);
  }

  initialize() {
    return this.knex.schema.createTableIfNotExists('shops', table => {
      table.increments('id');
      table.string('shopify_domain');
      table.string('access_token');
      table.unique('shopify_domain');
    });
  }

  async storeShop({ shop, accessToken }) {
    await this.knex.raw(
      `INSERT OR IGNORE INTO shops (shopify_domain, access_token) VALUES ('${shop}', '${accessToken}')`
    );

    return {accessToken};
  }

  getShop({ shop }) {
    return this.knex('shops').where('shopify_domain', shop)
  }
};
