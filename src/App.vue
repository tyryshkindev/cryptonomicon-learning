<script>
import UniteComponents from './components/UniteComponents.vue'
import LoadCircle from './components/LoadCircle.vue'
export default {
  name: 'App',

  components: {
    LoadCircle,
    UniteComponents
  }
}
</script>

<template>
  <LoadCircle />
  <UniteComponents />
</template>
