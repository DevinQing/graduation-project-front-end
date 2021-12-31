<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item v-for="(item, index) in list" :key="index">
      <span v-if="index === 0"
        ><a href="/">{{ item.meta.title }}</a></span
      >
      <span v-else>{{ item.meta.title }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  name: 'Breadcrumb',
  computed: {
    list() {
      return this.$route.matched
    }
  }
}
</script>

<style></style>
