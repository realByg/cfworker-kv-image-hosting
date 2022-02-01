import { Middleware } from '@cfworker/web'

const getImgByID: Middleware = async ({ req, res }) => {
	try {
		const imgID = req.params.imgID

		const imgDataURL = await KVIMG.get(imgID)
		if (!imgDataURL) {
			res.status = 404
			return
		}

		res.status = 200
		res.body = dataURLtoBlob(imgDataURL)
	} catch (error) {
		res.status = 500
		res.body = String(error)
	}
}

export default getImgByID

const dataURLtoBlob = (dataURL: string) => {
	const byteString = atob(dataURL.split(',')[1])
	const byteArrayBuffer = new ArrayBuffer(byteString.length)
	const byteArray = new Uint8Array(byteArrayBuffer)
	for (let i = 0; i < byteString.length; i++) {
		byteArray[i] = byteString.charCodeAt(i)
	}
	const mimeType = dataURL.split(':')[1].split(';')[0]
	return new Blob([byteArray], { type: mimeType })
}
