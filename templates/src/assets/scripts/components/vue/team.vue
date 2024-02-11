<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import Members from './team-members';
import Filters from './team-filter';
import { ref } from 'vue';

// State variables for managing filtered state of members list
const filters = ref([undefined, 'trim', 'tactic', 'helmsmann']);
const activeFilterIndex = ref(0);

// State variables for managing pagination
const perPage = ref(5);
const currentPage = ref(0);

// State variable for managing loading state of the members list
const loading = ref(false);
</script>

<style lang="scss" scoped>
.team {
  &-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 1rem;

    &-title {
      font-size: 2rem;
      font-weight: bold;
      color: $color-text-light;
    }
  }

  &-content {
    padding: 10rem 0;
  }
}

</style>

<template>
  <div class="container">
    <div class="team-header">
      <div class="team-header-title">
        <slot name="title"></slot>
      </div>

      <div class="team-header-nav">
        <Filters :filters="filters" :activeFilterIndex="activeFilterIndex"
          @update:filtered="activeFilterIndex = $event" />
      </div>
    </div>

    <div class="team-content">
        <div class="" v-if="loading">Loading...</div>
        <Members v-else :filters="filters" :activeFilterIndex="activeFilterIndex" :perPage="perPage"
            :currentPage="currentPage" />
    </div>

    <div></div>
  </div>
</template>
