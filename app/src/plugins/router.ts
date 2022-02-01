import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
	history: createWebHashHistory(),
	routes: [
		{
			path: '/',
			component: () => import('../views/ManageImgs.vue')
		},
		{
			path: '/up',
			component: () => import('../views/UploadImgs.vue')
		},
		{
			path: '/:path(.*)',
			redirect: '/'
		}
	]
})

export default router
