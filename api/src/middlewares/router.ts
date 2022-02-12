import { Router, validate } from '@cfworker/web'
import getImageByID from '../routes/get-image-by-id'
import listImages from '../routes/list-images'
import uploadImages from '../routes/upload-images'
import deleteImage from '../routes/delete-image'

const router = new Router()

router.get(
	'/img/:imageID',
	validate({
		params: { required: ['imageID'] }
	}),
	getImageByID
)

router.get('/api/imgs', listImages)

router.post('/api/imgs', uploadImages)

router.delete('/api/img', deleteImage)

router.all('/(.+)', ({ res }) => res.redirect('/'))

export default router
