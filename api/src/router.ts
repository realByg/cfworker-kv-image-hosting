import { Router, validate } from '@cfworker/web'
import uploadImages from './routes/upload-images'
import getImageByID from './routes/get-image-by-id'
import listImages from './routes/list-images'

const router = new Router()

router.get('/', ({ res }) => {
	res.status = 200
	res.body = ENV
})

router.get(
	'/img/:imageID',
	validate({
		params: {
			required: ['imageID']
		}
	}),
	getImageByID
)

router.get('/api/imgs', listImages)

router.post('/api/imgs', uploadImages)

router.delete('/api/imgs', ({ req, res }) => {
	res.status = 200
})

// cors options
router.all('/(.*)', ({ res }) => {
	res.status = 200
})

export default router
