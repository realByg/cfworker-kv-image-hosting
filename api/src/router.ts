import { Router, validate } from '@cfworker/web'
import basicAuth from './plugins/basic-auth'
import cors from './plugins/cors'

const router = new Router()

router.get('/', ({ res }) => {
	res.status = 200
})

router.get(
	'/img/:imgID',
	validate({
		params: {
			required: ['imgID']
		}
	}),
	cors,
	({ req, res }) => {
		res.status = 200
	}
)

router.get('/api/login', basicAuth, ({ res }) => {
	res.status = 200
})

router.get('/api/imgs', basicAuth, ({ res }) => {})

router.post('/api/imgs', basicAuth, ({ req, res }) => {})

router.delete('/api/imgs', basicAuth, ({ req, res }) => {})

// cors options
router.all('/(.*)', ({ res }) => {
	res.status = 200
})

export default router
