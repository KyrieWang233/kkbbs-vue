<template>
  <div>
    <p>{{ message }}</p>
  </div>
</template>

<script>
export default {
  name: "Error.vue",
  data() {
    return {
      message:this.$store.getters.get_error
    }
  },
}
</script>

<style scoped>

</style>