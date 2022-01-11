<template>
  <div class="level-three-module-container">
    <div class="one-query-form">
      <el-card>
        <el-form
          :inline="true"
          :model="queryForm"
          class="demo-form-inline"
          ref="queryFormRef"
          label-width="80px"
        >
          <el-form-item prop="scheduleId" label="进度ID">
            <el-input
              v-model="queryForm.scheduleId"
              placeholder="请输入进度ID"
            ></el-input>
          </el-form-item>
          <el-form-item prop="scheduleName" label="进度名称">
            <el-input
              v-model="queryForm.scheduleName"
              placeholder="请输入进度名称"
            ></el-input>
          </el-form-item>
          <el-form-item prop="state" label="进度状态">
            <el-select
              v-model="queryForm.state"
              placeholder="请选择进度任务状态"
            >
              <el-option
                v-for="(item, index) in stateList"
                :key="index"
                :label="item"
                :value="index"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="fetchListByParams"
              >查询</el-button
            >
          </el-form-item>
          <el-form-item>
            <el-button @click="resetQueryForm">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <div class="level-three-content">
      <el-card>
        <h1 class="title">进度任务列表</h1>

        <div class="add-module">
          <el-button type="primary" @click="addSchedule"
            >新增进度任务</el-button
          >
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
            <el-table-column label="详情" align="center">
              <template #default="{ row }">
                <div>
                  <el-button size="small" @click="checkDetail(row)"
                    >查看详情</el-button
                  >
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template #default="{ row }">
                <el-button size="small" @click="editSchedule(row)"
                  >编辑</el-button
                >
                <el-button size="small" type="danger">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="page-box">
            <span class="total-box">共 {{ total }} 条数据</span>
            <el-pagination
              background
              layout="prev, pager, next"
              :total="total"
              @current-change="pageChange"
              :current-page="page.pageNum"
            >
            </el-pagination>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { formatTime } from '@/utils/utils'
import { STATE_LIST } from '@/enum/schedule'
import { getScheduleList } from '@/api/schedule'
import { ElMessageBox, ElMessage } from 'element-plus'

export default {
  name: 'ProjectSchedule',
  data() {
    return {
      // 进度状态
      stateList: STATE_LIST,
      queryForm: {},
      isLoading: false,
      list: [],
      action: 'add',
      listMeta: [
        {
          label: '任务ID',
          prop: 'scheduleId'
        },
        {
          label: '任务名称',
          prop: 'scheduleName'
        },

        {
          label: '桩号',
          prop: 'station'
        },
        {
          label: '状态',
          prop: 'state',
          formatter(row, column, cellValue) {
            return STATE_LIST[cellValue]
          }
        },
        {
          label: '开始日期',
          prop: 'startTime',
          formatter(row, column, cellValue) {
            return formatTime(cellValue, 'YYYY-MM-DD')
          }
        },
        {
          label: '结束日期',
          prop: 'endTime',
          formatter(row, column, cellValue) {
            if (!cellValue) return '未定义'
            return formatTime(cellValue, 'YYYY-MM-DD')
          }
        }
      ],
      total: 0,
      page: {
        pageSize: 10,
        pageNum: 1
      },
      // 保存条件搜索后的数据
      parForm: {}
      // 表单类
    }
  },
  computed: {},
  // 监听的使用场景 我们需要监听某数组的变化 从而改变某个值
  watch: {},
  methods: {
    // 跳转页面
    jumpToDetail(params) {
      this.$router.push({
        name: 'scheduleDetail',
        query: params
      })
    },
    // 创建进度任务 跳转
    addSchedule() {
      this.action = 'add'
      const params = {
        action: 'add',
        id: 0
      }
      this.jumpToDetail(params)
    },
    // 编辑进度任务
    editSchedule(row) {
      const id = row.scheduleId
      const params = {
        action: 'edit',
        id: id
      }
      this.jumpToDetail(params)
    },
    // 查看详情
    checkDetail(row) {
      const id = row.scheduleId
      const params = {
        action: 'check',
        id: id
      }
      this.jumpToDetail(params)
    },
    // 根据参数获取列表
    fetchListByParams() {
      // 条件搜索的时候应该跳回第一页
      this.page.pageNum = 1
      const params = { ...this.queryForm, ...this.page }
      // 保存条件搜索的参数 方便分页
      this.parForm = { ...this.queryForm }
      this.fetchList(params)
    },
    // 重置搜索表单
    resetQueryForm() {
      this.$refs['queryFormRef'].resetFields()
    },
    // 获取进度任务列表
    async fetchList(params) {
      this.isLoading = true
      try {
        const { page, list } = await getScheduleList(params)
        this.list = list
        this.total = page.total
        this.isLoading = false
      } catch (err) {
        ElMessage.error(err)
        this.isLoading = false
      }
    },

    // 分页时候的操作
    pageChange(num) {
      this.page.pageNum = num
      const params = { ...this.parForm, ...this.page }
      this.fetchList(params)
    }
  },
  mounted() {
    this.fetchList({ ...this.page })
  }
}
</script>

<style lang="scss" scoped>
.level-three-module-container {
  .one-query-form {
    margin-bottom: 20px;
  }
  .level-three-content {
    .title {
      font-size: 20px;
      font-weight: 600;
      text-align: center;
    }
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
<style lang="scss">
.operate-module-box {
  overflow: auto;
  margin-bottom: 80px;
}
.son-module-list {
  & > li {
    display: flex;
    & > span {
      flex: 1;
    }
  }
}
.last-time-calc {
  display: flex;
  // background-color: blue;
}
.operate-module-three-footer {
  position: fixed;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: right;
  padding: 20px 30px;
}
.cycle-time-item {
  display: flex;
  align-items: center;
  span {
    flex: 0.33;
    padding: 5px 10px;
  }
  .delete-circle-time-icon {
    cursor: pointer;
    &:hover {
      color: #3f9eff;
    }
  }
}
.add-circle-time {
  font-size: 18px;
  display: flex;
  align-items: center;

  .add-circle-time-icon {
    cursor: pointer;
    &:hover {
      color: #3f9eff;
    }
  }
}
</style>
