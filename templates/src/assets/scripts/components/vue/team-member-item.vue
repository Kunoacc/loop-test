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
	isRowLast: {
		type: Boolean,
		default: false,
	},
});
</script>

<style lang="scss" scoped>
.member {
  text-align: center;
  min-width: 10rem;
  min-height: 10rem;
  position: relative;

  &-image {
    width: 100%;
    height: 100%;
    filter: grayscale(100%);
    transition: filter 0.3s;

    &:hover {
      filter: none;

      ~.member-info {
        width: 100%;
        transform: translateX(100%);
        opacity: 1;
        transition: transform 0.3s, width 0.6s 0.3s, opacity 0.4s 0.4s;
      }

      ~.member-info__last {
        width: 100%;
        transform: translateX(-100%);
        opacity: 1;
        transition: transform 0.3s, width 0.6s 0.3s, opacity 0.4s 0.4s;
      }
    }
  }

  &-info {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-end;
    padding: 2rem;
    background: $color-light;
    width: 0%;
    opacity: 0;
    pointer-events: none;
    z-index: 10;

    &__name {
      font-size: 1.5rem;
      margin-bottom: 5px;
      color: $color-text-primary;
      text-transform: uppercase;
    }

    &__bio {
      font-size: 1.2rem;
    }
  }
}
</style>

<template>
  <div class="member">
    <img :src="props.image" :alt="props.name" class="member-image" loading="lazy" />
    <div :class="{'member-info': true, 'member-info__last': props?.isRowLast}">
      <h2 class="member-info__name">{{ props.name }}</h2>
      <p class="member-info__bio">{{ props.bio }}</p>
    </div>
  </div>
</template>
