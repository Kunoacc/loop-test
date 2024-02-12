<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import Members from './team-members';
import Filters from './team-filter';
import { ref, watch } from 'vue';
import TeamGridConfig from './team-grid-config';

// State variables for managing filtered state of members list
const filters = ref([undefined, 'trim', 'tactic', 'helmsmann']);
const activeFilterIndex = ref(0);

// State variables for managing pagination
const perPage = ref(5);
const currentPage = ref(0);

// State variable for managing loading state of the members list
const loading = ref(true);

// Fetch grid configuration from the TeamGridConfig component
const gridConfig = ref(null);

// reset current page on filter change
watch(activeFilterIndex, () => {
	currentPage.value = 0;
});
</script>

<style lang="scss">
.team {
  &-header {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: .5rem;
    flex-direction: column;
    column-gap: 1rem;
    text-align: center;

    @include mq('tablet-landscape') {
      column-gap: 0;
      flex-direction: row;
      justify-content: space-between;
      margin-bottom: 1rem;
      align-items: flex-end;
      text-align: initial;
    }

    &-title {
      font-size: 2rem;
      font-weight: bold;
      color: $color-text-light;
    }

    &-nav {
      margin-top: 2rem;

      @include mq('tablet-landscape') {
        margin-top: 0;
      }
    }
  }

  &-content {
    padding: 10rem 0 2rem;
    width: 100%;
  }

  &-footer {
    display: flex;
    align-items: flex-end;
    flex-direction: column;
    width: 100%;
    padding: 0rem 2rem;

    @include mq('tablet') {
      justify-content: flex-end;
    }

    &-cta {
      background-color: $color-text-light;
      color: $color-dark;
      align-self: center;
    }
  }
}
</style>

<template>
  <div>
    <div class="team-header container">
      <div class="team-header-title">
        <slot name="title"></slot>
      </div>

      <div class="team-header-nav">
        <Filters :filters="filters" :activeFilterIndex="activeFilterIndex"
          @update:filtered="activeFilterIndex = $event" />
      </div>
    </div>

    <div class="team-content">
      <Members :filter="filters[activeFilterIndex]" :perPage="perPage" :currentPage="currentPage"
        :gridColumns="gridConfig" @update:loading="loading = $event" />
    </div>

    <div class="team-footer">
      <TeamGridConfig @update:grid-columns="gridConfig = $event" :grid-columns="gridConfig" />
      <div class="team-footer-cta" @click.prevent="currentPage += 1">
        <slot name="load"></slot>
      </div>
    </div>
  </div>
</template>
