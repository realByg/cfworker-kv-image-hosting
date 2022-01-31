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

router.get('/api/imgs', basicAuth, ({ req, res }) => {
	res.status = 200
})

router.put('/api/imgs', basicAuth, ({ req, res }) => {
	res.status = 200
})

router.delete('/api/imgs', basicAuth, ({ req, res }) => {
	res.status = 200
})

router.all('/(.*)', ({ res }) => res.redirect('/'))

export default router
