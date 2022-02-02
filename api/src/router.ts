import { Router, validate } from '@cfworker/web'
import uploadImages from './routes/upload-images'
import getImageByID from './routes/get-image-by-id'
import listImages from './routes/list-images'
import deteleImageByID from './routes/delete-image-by-id'

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

router.delete('/api/img', deteleImageByID)

// cors options
router.all('/(.*)', ({ res }) => {
	res.status = 200
})

export default router
