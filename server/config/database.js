module.exports = ({ env }) => ({
	defaultConnection: 'default',
	connections: {
		default: {
			connector: 'bookshelf',
			settings: {
				client: 'postgres',
				host: env('DATABASE_HOST', 'localhost'),
				port: env.int('DATABASE_PORT', 5432),
				database: env('DATABASE_NAME', 'strapi'),
				username: env('DATABASE_USERNAME', 'postgres'),
				password: env('DATABASE_PASSWORD', 'postgres'),
				schema: 'public',
				ssl: env('DATABASE_SSL', false)
			},
			options: {
				// ssl: {
				// 	'rejectUnauthorized': false
				// }
				'pool': {
					'min': 0,
					'max': 15,
					'idleTimeoutMillis': 30000,
					'createTimeoutMillis': 30000,
					'acquireTimeoutMillis': 30000
				}
			}
		},
	},
})