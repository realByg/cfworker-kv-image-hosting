import { Middleware } from '@cfworker/web'

const cors: Middleware = async ({ res }, next) => {
	res.headers.set('Access-Control-Allow-Origin', '*')
	await next()
}

export default cors
