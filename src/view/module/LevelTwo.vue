<template>
  <div class="level-two-module-container">
    <div class="two-query-form">
      <el-card>
        <el-form
          :inline="true"
          :model="queryForm"
          class="demo-form-inline"
          ref="queryFromRef"
        >
          <el-form-item prop="userName">
            <el-input
              v-model="queryForm.moduleId"
              placeholder="请输入模块id"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="fetchLevelOneListByParams"
              >查询</el-button
            >
          </el-form-item>
          <el-form-item>
            <el-button @click="resetQueryForm">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <div class="level-two-content">
      <el-card>
        <div class="add-module">
          <el-button type="primary">新增模块</el-button>
        </div>
        <div>
          <el-table
            v-loading="isLoading"
            :data="list"
            stripe
            border
            style="width: 100%"
            :header-row-style="{ 'font-weight': '600' }"
          >
            <el-table-column
              v-for="item in listMeta"
              :key="item.prop"
              :prop="item.prop"
              :label="item.label"
              :width="item.width"
              align="center"
              :formatter="item.formatter"
            />
            <el-table-column label="操作" align="center">
              <template #default="{ row }">
                <el-button size="small" @click="edit(row)">编辑</el-button>
                <el-button size="small" type="danger">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="page-box">
            <span class="total-box">共 {{ total }} 条数据</span>
            <el-pagination background layout="prev, pager, next" :total="total">
            </el-pagination>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LevelTwoModule',
  data() {
    return {
      queryForm: {
        moduleId: ''
      },
      isLoading: false,
      list: [],
      listMeta: [],
      total: 0,
      page: {
        pageSize: 10,
        pageNum: 1
      }
    }
  },
  methods: {
    fetchLevelOneListByParams() {
      console.log('查询')
    },
    resetQueryForm() {
      console.log('重置')
    },
    edit() {}
  }
}
</script>

<style lang="scss" scoped>
.level-two-module-container {
  .two-query-form {
    margin-bottom: 20px;
  }
  .level-two-content {
    .add-module {
      margin-bottom: 20px;
    }
    .page-box {
      padding: 20px;
      display: flex;
      justify-content: end;
      align-items: center;
      .total-box {
        font-size: 14px;
        padding-right: 10px;
      }
    }
  }
}
</style>
