<template>
  <template v-for="item in menuList" :key="item.name">
    <el-sub-menu :index="item.path" v-if="!!item.children && !item.meta.hidden">
      <template #title>
        <el-icon><histogram /></el-icon>
        <span>{{ item.meta.title }}</span>
      </template>
      <menu-list :menuList="item.children"></menu-list>
    </el-sub-menu>
    <el-menu-item
      :index="item.path"
      v-else-if="!item.children && !item.meta.hidden"
    >
      <span>{{ item.meta.title }}</span>
    </el-menu-item>
  </template>
</template>

<script>
export default {
  name: 'MenuList',
  props: {
    menuList: Array
  }
}
</script>

<style lang="scss"></style>
