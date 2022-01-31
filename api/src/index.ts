import { Application, normalizePathnameMiddleware } from '@cfworker/web'
import router from './router'

new Application().use(normalizePathnameMiddleware).use(router.middleware).listen()
