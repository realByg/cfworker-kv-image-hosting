import type { Middleware } from '@cfworker/web'

const cors: Middleware = async ({ req, res }, next) => {
	if (req.method === 'OPTIONS') {
		res.status = 200
		return
	}

	res.headers.set('Access-Control-Allow-Origin', '*')
	res.headers.set('Access-Control-Allow-Credentials', 'true')
	res.headers.set('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, HEAD, OPTIONS')
	res.headers.set(
		'Access-Control-Allow-Headers',
		'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers'
	)
	await next()
}

export default cors
