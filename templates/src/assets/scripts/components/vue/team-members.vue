<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import Member from './team-member-item';
// @ts-ignore
import { ref, toRefs, watchEffect, defineProps, defineEmits, onMounted } from 'vue';
// @ts-ignore
import { call } from '../../models/http-request';
// @ts-ignore
import { API_BASE_URL } from '../../constants/index';

const props = defineProps({
	filters: {
		type: Array,
		required: true,
	},
	activeFilterIndex: {
		type: Number,
		required: true,
	},
	perPage: {
		type: Number,
		required: true,
	},
	currentPage: {
		type: Number,
		required: true,
	},
});

const emit = defineEmits(['update:loading']);

// Destructure props
const { activeFilterIndex, currentPage, filters, perPage } = toRefs(props);

// Due to enviromnent constraints, we use JSDoc to define the type of the response.
/**
 * @typedef {Object} Member
 * @property {string} name
 * @property {string} image
 * @property {string} duty
 * @property {number} id
 * @property {Array<string>} duty_slugs
 */

/**
 * @type {import('vue').Ref<Member[]>}
 */
const members = ref([]);

/**
 * @function fetchMembers
 * @returns {Promise<Member[]>}
 */
const fetchMembers = async (filter, perPage = 5, currentPage = 0) => {
	const url = new URL('', API_BASE_URL);
	filter && url.searchParams.set('filter', filter);
	url.searchParams.set('per_page', perPage);
	url.searchParams.set('page', currentPage);
	emit('update:loading', true);
	const response = await call(url.toString(), 'GET', {}, true, { Authorization: 'Bearer 0123456789' });
	emit('update:loading', false);
	return response?.data?.data;
};

// Watch for changes in the active filter index, page number and per page value and fetch members accordingly
watchEffect(async () => {
	// Fetch members from the API
	const data = await fetchMembers(filters.value[activeFilterIndex.value], perPage.value, currentPage.value);

	// If the current page is 0, replace the members value with the new data, otherwise append the new data to the existing members value
	if (currentPage.value === 0) {
		members.value = data;
	} else {
		members.value = [...members.value, ...data];
	}
});

// State variables for variable grid configuration
const gridConfig = ref({
	1: 'repeat(1, 1fr)',
	2: 'repeat(2, 1fr)',
	3: 'repeat(3, 1fr)',
	4: 'repeat(4, 1fr)',
	5: 'repeat(5, 1fr)',
	6: 'repeat(6, 1fr)',
});
const gridColumns = ref(gridConfig.value[perPage.value]);

// Fetch members on component mount, make async dependency available
onMounted(async () => {
	const data = await fetchMembers(filters.value[activeFilterIndex.value]);
	console.log(data);
	members.value = data;
});
</script>

<style lang="scss">
.members {
  display: grid;
  gap: 0px;
  justify-content: center;
}
</style>

<template>
  <div class="members" :style="{ gridTemplateColumns: gridColumns }">
    <Member v-for="member in members" :key="member.id" :name="member?.name" :image="member?.image" :bio="member?.duty" />
  </div>
</template>
