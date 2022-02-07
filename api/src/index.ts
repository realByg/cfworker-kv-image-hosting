import { Application, normalizePathnameMiddleware } from '@cfworker/web'
import router from './router'
import cors from './plugins/cors'
import basicAuth from './plugins/basic-auth'
import staticContent from './plugins/static-content'

new Application()
	.use(normalizePathnameMiddleware)
	.use(basicAuth)
	.use(router.middleware)
	.use(cors)
	.use(staticContent)
	.listen()
