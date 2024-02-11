<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { defineProps } from 'vue';

const props = defineProps({
	name: {
		type: String,
		required: true,
	},
	bio: {
		type: String,
		required: true,
	},
	image: {
		type: String,
		required: true,
	},
});
</script>

<template>
  <div class="member">
    <img :src="props.image" :alt="props.name" class="member__image" />
    <div class="member-info">
      <h2 class="member-info__name">{{ props.name }}</h2>
      <p class="member-info__bio">{{ props.bio }}</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.member {
  text-align: center;
  margin-bottom: 20px;
  width: 18rem;
  height: 18rem;

  &__image {
    width: 100%;
    height: 100%;
    filter: grayscale(100%);
    transition: filter 0.3s;

    &:hover {
      filter: none;
    }
  }

  &-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: $color-light;

    &__name {
      font-size: 1.5rem;
      margin-bottom: 5px;
      display: none;
      color: $color-text-primary;
    }

    &__bio {
      font-size: 1.2rem;
      display: none;
    }
  }
}
</style>
