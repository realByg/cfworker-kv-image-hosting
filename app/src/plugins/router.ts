import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
	history: createWebHashHistory(),
	routes: [
		{
			path: '/',
			component: () => import('../views/ManageImages.vue')
		},
		{
			path: '/up',
			component: () => import('../views/UploadImages.vue')
		},
		{
			path: '/:path(.*)',
			redirect: '/'
		}
	]
})

export default router
