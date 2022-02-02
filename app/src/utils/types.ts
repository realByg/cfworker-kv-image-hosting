export type ConvertedImage = {
	file: File
	tmpSrc: string
}

export type UploadedImage = {
	src: string
	size: number
	name: string
	uploadedAt: number
	expiresAt: number
}
