import { Router, validate } from '@cfworker/web'
import uploadImgs from './routes/upload-imgs'
import getImgByID from './routes/get-img-by-id'

const router = new Router()

router.get('/', ({ res }) => {
	res.status = 200
	res.body = ENV
})

router.get(
	'/img/:imgID',
	validate({
		params: {
			required: ['imgID']
		},
	}),
	getImgByID
)

router.get('/api/imgs', ({ res }) => {
	res.status = 200
})

router.post('/api/imgs', uploadImgs)

router.delete('/api/imgs', ({ req, res }) => {
	res.status = 200
})

// cors options
router.all('/(.*)', ({ res }) => {
	res.status = 200
})

export default router
