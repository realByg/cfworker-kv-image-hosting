import { Application, normalizePathnameMiddleware } from '@cfworker/web'
import router from './middlewares/router'
import cors from './middlewares/cors'
import basicAuth from './middlewares/basic-auth'
import staticContent from './middlewares/static-content'

new Application()
	.use(normalizePathnameMiddleware)
	.use(basicAuth)
	.use(staticContent)
	.use(router.middleware)
	.use(cors)
	.listen()
