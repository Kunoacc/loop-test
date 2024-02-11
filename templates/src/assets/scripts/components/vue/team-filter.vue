<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { defineEmits, defineProps } from 'vue';

const props = defineProps({
	filters: {
		type: Array,
		required: true,
	},
	activeFilterIndex: {
		type: Number,
		required: true,
	},
});

const emits = defineEmits(['update:filtered']);
</script>

<style lang="scss" scoped>
.filter {
  display: grid;
  align-content: flex-start;
  justify-items: center;
  column-gap: 1rem;
  color: $color-text-light;
  transition: color 0.3s;
  grid-template-columns: repeat(4, 1fr);

  &-button {
    border: none;
    background: transparent;
    color: $color-text-light;
    cursor: pointer;
    text-transform: uppercase;
    font-weight: bold;
    transition: color 0.3s;
    position: relative;
    padding-bottom: .25rem;

    &::before {
      content: '';
      display: block;
      width: 0%;
      height: 2px;
      transition: width 0.3s;
      position: absolute;
      bottom: 0;
      top: calc(100% - 5px);
      background-color: rgba($color: #ffffff, $alpha: 1.0);
    }

    &:hover {
      &::before {
        width: 100%;
      }
    }

    &__active {
      color: $color-text-primary;
    }
  }
}
</style>

<template>
  <div class="filter">
    <button v-for="(filter, index) in filters" :key="index"
      :class="{ 'filter-button__active': index === props.activeFilterIndex, 'filter-button': true }"
      @click="index !== props.activeFilterIndex && emits('update:filtered', index)">
      {{ filter ?? 'Show All' }}
    </button>
  </div>
</template>
