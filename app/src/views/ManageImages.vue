<template>
	<div class="mx-auto max-w-6xl my-4 px-4 relative">
		<loading-overlay :loading="loading" />

		<div class="text-gray-800 text-lg">管理图片</div>
		<div class="mb-4 text-sm text-gray-500">
			已上传 {{ convertedImages.length }} 张图片，共 {{ formatBytes(imagesTotalSize) }}
		</div>

		<div class="grid gap-4 grid-cols-3">
			<transition-group name="el-fade-in-linear">
				<div
					class="col-span-3 md:col-span-1"
					v-for="item in convertedImages"
					:key="item.id"
				>
					<image-box
						:src="item.src"
						:size="item.size"
						:name="item.name"
						@delete="deleteImage(item.id)"
						mode="manage"
						:uploaded-at="item.uploadedAt"
						:expires-at="item.expiresAt"
					/>
				</div>
			</transition-group>
		</div>
	</div>
</template>

<script setup lang="ts">
import { requestListImages } from '../utils/request'
import LoadingOverlay from '../components/LoadingOverlay.vue'
import formatBytes from '../utils/format-bytes'
import { computed, onMounted, ref } from 'vue'
import type { ConvertedImage } from '../utils/types'
import ImageBox from '../components/ImageBox.vue'

const loading = ref(false)
const convertedImages = ref<ConvertedImage[]>([])
const imagesTotalSize = computed(() =>
	convertedImages.value.reduce((total, item) => total + item.size, 0)
)

const listImages = () => {
	loading.value = true
	requestListImages()
		.then((data) => {
			convertedImages.value = data.sort((a, b) =>
				a.uploadedAt > b.uploadedAt ? -1 : b.uploadedAt > a.uploadedAt ? 1 : 0
			)
		})
		.catch(() => {})
		.finally(() => {
			loading.value = false
		})
}

onMounted(() => {
	listImages()
})

const deleteImage = (id: string) => {}
</script>
