type BaseImage = {
	id: string
	name: string
	expiresAt: number
}

export interface ConvertedImage extends BaseImage {
	dataURL: string
	tmpSrc: string
}

export interface UploadedImage extends BaseImage {
	src: string
	size: number
	uploadedAt: number
}
