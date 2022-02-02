export {}

declare global {
	const ENV: 'dev' | 'prod'
	const PASSWORD: string
	const USERNAME: string
	const ImageKV: KVNamespace
	const __STATIC_CONTENT: KVNamespace
}
