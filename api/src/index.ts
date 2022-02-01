import { Application, normalizePathnameMiddleware } from '@cfworker/web'
import router from './router'
import cors from './plugins/cors'
import basicAuth from './plugins/basic-auth'

new Application()
	.use(normalizePathnameMiddleware)
	.use(basicAuth)
	.use(cors)
	.use(router.middleware)
	.listen()
