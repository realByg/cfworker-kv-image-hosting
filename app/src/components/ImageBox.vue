<template>
	<div class="w-full bg-slate-200 rounded-md shadow-sm overflow-hidden relative">
		<img
			class="block w-full h-60 object-cover cursor-zoom-in"
			:src="props.src"
			@click="viewImage"
		/>
		<div class="w-full p-2 absolute left-0 bottom-0 bg-slate-800/70 backdrop-blur-sm">
			<div class="w-full flex items-center text-white">
				<div class="flex-1 w-full truncate">
					<el-tooltip :content="props.name" placement="top-start">
						{{ props.name }}
					</el-tooltip>
				</div>
				<font-awesome-icon
					:icon="faTrashAlt"
					class="cursor-pointer"
					@click="emit('delete')"
				></font-awesome-icon>
			</div>
			<div class="text-xs text-gray-300">
				{{ formatBytes(props.size) }}
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons'
import formatBytes from '../utils/format-bytes'
import { api as imageViewer } from 'v-viewer'
import { ElTooltip } from 'element-plus'

const props = defineProps<{
	src: string
	name: string
	size: number
}>()
const emit = defineEmits(['delete'])

const viewImage = () => {
	imageViewer({
		images: [props.src],
		options: {
			navbar: false,
			toolbar: false
		}
	})
}
</script>
