import { createStore } from 'vuex'

const store = createStore({
	state: () => ({
		loginAreaVisible: false
	}),

	mutations: {
		setLoginAreaVisible(state, visible: boolean) {
			state.loginAreaVisible = visible
		}
	}
})

export default store
