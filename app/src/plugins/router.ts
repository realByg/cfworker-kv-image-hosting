import { createRouter, createWebHashHistory } from 'vue-router'
import store from '../plugins/store'
import { getBasicToken } from '../utils/local-storage'
import { ElNotification } from 'element-plus'

const router = createRouter({
	history: createWebHashHistory(),
	routes: [
		{
			path: '/manage',
			component: () => import('../views/Manage.vue')
		},
		{
			path: '/upload',
			component: () => import('../views/Upload.vue')
		},
		{
			path: '/:path(.*)',
			redirect: '/manage'
		}
	]
})

router.beforeEach(() => {
	const basicToken = getBasicToken()

	if (!basicToken) {
		ElNotification({
			message: '请登录',
			type: 'warning'
		})
		store.commit('setLoginAreaVisible', true)
	}
})

export default router
