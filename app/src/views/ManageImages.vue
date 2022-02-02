<template>
	<div class="mx-auto max-w-6xl my-4 px-4 relative">
		<loading-overlay :loading="loading" />

		<div class="flex items-center justify-between mb-4">
			<div>
				<div class="text-gray-800 text-lg">管理图片</div>
				<div class="text-sm text-gray-500">
					已上传 {{ uploadedImages.length }} 张图片，共 {{ formatBytes(imagesTotalSize) }}
				</div>
			</div>
			<font-awesome-icon
				:icon="faRedoAlt"
				class="text-xl cursor-pointer"
				@click="listImages"
			></font-awesome-icon>
		</div>

		<div class="grid gap-4 grid-cols-3">
			<transition-group name="el-fade-in-linear">
				<div class="col-span-3 md:col-span-1" v-for="item in uploadedImages" :key="item.id">
					<image-box
						:src="item.src"
						:size="item.size"
						:name="item.name"
						@delete="deleteImage(item.id)"
						mode="uploaded"
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
import type { UploadedImage } from '../utils/types'
import ImageBox from '../components/ImageBox.vue'
import { faRedoAlt } from '@fortawesome/free-solid-svg-icons'

const loading = ref(false)
const uploadedImages = ref<UploadedImage[]>([])
const imagesTotalSize = computed(() =>
	uploadedImages.value.reduce((total, item) => total + item.size, 0)
)

const listImages = () => {
	loading.value = true
	requestListImages()
		.then((data) => {
			uploadedImages.value = data.sort((a, b) =>
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
