import { Router, validate } from '@cfworker/web'
import uploadImages from './routes/upload-images'
import getImageByID from './routes/get-image-by-id'
import listImages from './routes/list-images'
import deteleImageByID from './routes/delete-image-by-id'

const router = new Router()

router.get('/bruh', async ({ req, res }) => {
	res.body = await __STATIC_CONTENT.get('favicon.f343726eb1.ico', 'stream')
})

router.get('/', async ({ req, res }) => {
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

router.all('/(.*)', ({ res }) => {
	if (ENV === 'dev') {
		// cors options
		res.status = 200
	} else {
		res.redirect('/')
	}
})

export default router
