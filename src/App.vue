<script>
import UniteComponents from '@/components/UniteComponents.vue'
import LoadCircle from '@/components/LoadCircle.vue'
export default {
  name: 'App',

  components: {
    LoadCircle,
    UniteComponents
  },
  data() {
    return {
      isLoading: true
    }
  },
  mounted() {
    this.isLoading = false
  }
}
</script>

<template>
  <LoadCircle v-show="isLoading"/>
  <UniteComponents v-show="!isLoading"/>
</template>
