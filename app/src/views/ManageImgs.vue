<template>
	<div class="mx-auto max-w-6xl my-4 px-4">
		<div class="text-gray-800 text-lg">管理图片</div>
		<div class="mb-4 text-sm text-gray-500">已上传 0 张图片，共 0 B</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { requestGetImgs } from '../utils/request'

onMounted(() => {
	requestGetImgs()
})
</script>
