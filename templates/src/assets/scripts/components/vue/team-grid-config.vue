<script setup>
import { computed, onBeforeUnmount, onMounted, ref, defineEmits, defineProps, toRefs } from 'vue';
import { initBreakpointWatching, currentlyActiveBreakpoints, removeBreakpointWatching } from '../../models/breakpoints';
import { listen, unlisten } from '../../models/utils/event-bus';

// emit the grid configuration to the parent component
const emits = defineEmits(['update:grid-columns']);

const props = defineProps({
	gridColumns: {
		required: true,
	},
});

const { gridColumns } = toRefs(props);

// Make the current active breakpoint avaibale and reactive
const activeBreakpoints = ref(currentlyActiveBreakpoints);

// Calculate if the current breakpoint is below the medium threshold
const calculateIntitialGridSize = computed(() => {
	const breakpointToSizeMap = {
		desktop: 4,
		tablet: 3,
		mobile: 2,
	};

	// Find the first active breakpoint in the map
	const matchingBreakpoint = [...activeBreakpoints.value]?.reverse().find(bp => breakpointToSizeMap[bp]);

	console.log(matchingBreakpoint);

	// Return the size for the matching breakpoint, or 1 as default
	return breakpointToSizeMap[matchingBreakpoint] || 1;
});

const gridConfig = ref({
	1: 'repeat(1, 1fr)',
	2: 'repeat(2, 1fr)',
	3: 'repeat(3, 1fr)',
	4: 'repeat(4, 1fr)',
	5: 'repeat(5, 1fr)',
	6: 'repeat(6, 1fr)',
});

// Calculate the validity of the grid size based on the active breakpoints
const calculateGridSizeVaildity = (gridSize) =>
	(activeBreakpoints.value.includes('desktop') && activeBreakpoints.value.includes('tablet') && gridSize >= 4) ||
	(!activeBreakpoints.value.includes('desktop') && activeBreakpoints.value.includes('tablet') && gridSize >= 2 && gridSize <= 4) ||
  (!activeBreakpoints.value.includes('tablet') && activeBreakpoints.value.includes('mobile') && gridSize <= 2)
;

onMounted(() => {
	initBreakpointWatching();
	emits('update:gridColumns', gridConfig.value[calculateIntitialGridSize.value]);
	// Note: ideally the event names should be defined in a constants file and imported here
	listen('active-breakpoints-change', (breakpoint) => {
		activeBreakpoints.value = breakpoint?.detail;
		emits('update:gridColumns', gridConfig.value[calculateIntitialGridSize.value]);
	});
});

// remove the breakpoint watching on component unmount for performance optimization
onBeforeUnmount(() => {
	removeBreakpointWatching();
	unlisten('active-breakpoints-change');
});
</script>

<style lang="scss" scoped>
.team-grid-config {
  display: grid;
  column-gap: .25rem;
  justify-content: center;
  margin-bottom: 1rem;
  grid-template-columns: repeat(3, 1fr);
  width: min-content;

  &-item {
    padding: .5rem;
    cursor: pointer;
    position: relative;
    color: $color-text-light;
    font-size: 1.25rem;
    display: none;

    &__active {
      &::before {
        content: '';
        display: block;
        width: 100%;
        height: 2px;
        transition: width 0.3s;
        position: absolute;
        bottom: 0;
        left: 0;
        top: calc(100% - 5px);
        background-color: $color-text-primary;
      }
    }

    &__valid {
      display: block;
    }
  }
}
</style>

<template>
  <div class="team-grid-config">
    <button v-for="n in 6" :key="n" :class="{
      'team-grid-config-item__active': gridConfig[n] == gridColumns,
      'team-grid-config-item__valid': calculateGridSizeVaildity(n),
      'team-grid-config-item': true
    }" @click="emits('update:gridColumns', gridConfig[n])">
      {{ n }}
    </button>
  </div>
</template>
