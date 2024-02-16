<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import Member from './team-member-item';
import { ref, toRefs, watchEffect, defineProps, defineEmits, onMounted } from 'vue';
import { call } from '../../models/http-request';
import { API_BASE_URL } from '../../constants/index';

const props = defineProps({
	filter: {
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
	gridColumns: {
		required: true,
	},
});

const emit = defineEmits(['update:loading']);

// Destructure props
const { currentPage, filter, perPage, gridColumns } = toRefs(props);

// Due to enviromnent constraints, we use JSDoc to define the type of the response.
/**
 * @typedef {Object} Member
 * @property {string} name
 * @property {string} image
 * @property {string} duties
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
 * @param {string} filter
 * @param {number} perPage
 * @param {number} currentPage
 * @description Fetches members from the API
 */
const fetchMembers = async (filter, perPage = 5, currentPage = 1) => {
	const url = new URL('', API_BASE_URL);
	filter && url.searchParams.set('duty', filter);
	url.searchParams.set('limit', perPage);
	url.searchParams.set('page', currentPage);
	emit('update:loading', true);
	const response = await call(url.toString(), 'GET', {}, true, { Authorization: 'Bearer 0123456789' });
	emit('update:loading', false);
	return response?.data?.data;
};

// Compute whether the current element is the last element on the row
const computeIsLastElementOnRow = (index) => {
	const match = gridColumns.value.match(/repeat\((\d+), (\d+)(px|fr)\)/);
	if (!match) return false;
	const [_, repeat] = match;
	return (index + 1) % parseInt(repeat) === 0;
};

// Watch for changes in the active filter index, page number and per page value and fetch members accordingly
watchEffect(async () => {
	// Fetch members from the API
	const data = await fetchMembers(filter.value, perPage.value, currentPage.value);

	// If the current page is 1, replace the members value with the new data, otherwise append the new data to the existing members value
	if (currentPage.value === 1) {
		members.value = data;
	} else {
		members.value = [...members.value, ...data];
	}
});

// Fetch members on component mount, make async dependency available
onMounted(async () => {
	const data = await fetchMembers(filter.value);
	members.value = data;
});

// TODO: optionally use the URL to manage state
</script>

<style lang="scss">
.members {
  display: grid;
  gap: 0px;
  justify-content: center;
}
</style>

<template>
  <!-- TODO: add a loader that's toggled on loading state, not added due to time constraints -->
  <div class="members" :style="{ gridTemplateColumns: gridColumns }">
    <Member v-for="(member, index) in members" :key="member.id" :name="member?.name" :image="member?.image"
      :bio="member?.duties" :is-row-last="computeIsLastElementOnRow(index)" />
  </div>
</template>
