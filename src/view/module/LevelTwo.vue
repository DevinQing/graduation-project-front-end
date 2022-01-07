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
          <div>
            <el-form-item prop="moduleId" label="模块ID">
              <el-input
                v-model="queryForm.moduleId"
                placeholder="请输入模块id"
              ></el-input>
            </el-form-item>
            <el-form-item prop="moduleName" label="模块名称">
              <el-input
                v-model="queryForm.moduleName"
                placeholder="请输入模块名称"
              ></el-input>
            </el-form-item>
            <el-form-item prop="constrMethod" label="施工方法">
              <el-input
                v-model="queryForm.constrMethod"
                placeholder="请输入施工方法"
              ></el-input>
            </el-form-item>
          </div>
          <div>
            <el-form-item prop="from" label="模块来源">
              <el-input
                v-model="queryForm.from"
                placeholder="请输入模块来源项目"
              ></el-input>
            </el-form-item>
            <el-form-item prop="rockLevel" label="围岩等级">
              <el-select
                v-model="queryForm.rockLevel"
                placeholder="请选择围岩等级"
              >
                <el-option
                  v-for="(item, index) in rockLevelList"
                  :key="index"
                  :label="item"
                  :value="index"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="moduleType" label="模块类型">
              <el-select
                v-model="queryForm.moduleType"
                placeholder="请选择模块类型"
              >
                <el-option
                  v-for="(item, index) in moduleTypeList"
                  :key="index"
                  :label="item"
                  :value="index"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </div>
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

    <div class="level-three-content">
      <el-card>
        <h1 class="title">二级模块列表</h1>

        <div class="add-module">
          <el-button type="primary" @click="addModule">新增模块</el-button>
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
                <el-button size="small" @click="checkDetail(row.moduleId)"
                  >查看详情</el-button
                >
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template #default="{ row }">
                <el-button size="small" @click="editModule(row)"
                  >编辑</el-button
                >
                <el-button size="small" type="danger" @click="deleteModule(row)"
                  >删除</el-button
                >
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

    <!-- 操作三级模块的对话框 -->
    <el-drawer
      v-model="dialogVisible"
      :title="`${action == 'add' ? '新增' : '编辑'}二级模块`"
      :before-close="confirmClose"
      size="40%"
      custom-class="operate-module-box"
    >
      <div class="demo-drawer__content">
        <el-form
          :model="form"
          style="width: 85%; padding-bottom: 80px"
          ref="formRef"
          :rules="formRules"
          label-width="120px"
        >
          <el-form-item label="模块名称" prop="moduleName">
            <el-input
              v-model="form.moduleName"
              placeholder="请填写模块名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="模块类型" prop="moduleName">
            <el-radio-group v-model="form.moduleType">
              <el-radio :label="1">普通模块</el-radio>
              <el-radio :label="2">循环模块</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="子模块Id"
            prop="childrenStr"
            v-show="form.moduleType == 2"
          >
            <div class="last-time-calc">
              <el-input
                v-model="form.childrenStr"
                placeholder="请输入子模块ID,用英文逗号隔开"
              >
              </el-input>
              <el-button @click="calcPlanLastTime">计划持续时间推算</el-button>
            </div>
          </el-form-item>
          <el-form-item
            label="子模块列表"
            v-if="form.children.length > 0 && form.moduleType == 2"
          >
            <ul class="son-module-list">
              <li v-for="item in form.children" :key="item.moduleId">
                <span>{{ item.moduleName }}</span>
                <span>{{ item.cycleTime }}min</span>
                <span
                  ><el-button
                    type="primary"
                    plain
                    @click="checkDetail(item.moduleId)"
                    >查看详情</el-button
                  ></span
                >
              </li>
            </ul>
          </el-form-item>
          <el-form-item
            label="循环进尺"
            prop="cycleForward"
            v-show="form.moduleType == 2"
          >
            <el-input-number v-model="form.cycleForward" :min="0" />
            <span>（单位：米）</span>
          </el-form-item>
          <el-form-item
            label="月进尺"
            prop="monthForward"
            v-show="form.moduleType == 2"
            :min="0"
          >
            <el-input-number v-model="form.monthForward" />
            <span>（单位：米）</span>
          </el-form-item>
          <el-form-item
            label="计划持续时间"
            prop="planLastTime"
            v-show="form.moduleType == 1"
            :min="0"
          >
            <el-input-number v-model="form.planLastTime" />
            <span>（单位：天）</span>
          </el-form-item>
          <el-form-item label="施工方法" prop="constrMethod">
            <el-input
              v-model="form.constrMethod"
              placeholder="请填写模块方法"
            ></el-input>
          </el-form-item>
          <el-form-item label="围岩等级" prop="rockLevel">
            <el-select v-model="form.rockLevel" placeholder="请选择围岩等级">
              <el-option
                v-for="(item, index) in rockLevelList"
                :key="index"
                :label="item"
                :value="index"
                v-show="index > 0"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="备注" prop="remark">
            <el-input
              v-model="form.remark"
              :autosize="{ minRows: 5 }"
              type="textarea"
              placeholder="请输入备注信息（如环境条件，所属项目，团队规模等）"
            >
            </el-input>
          </el-form-item>
        </el-form>
        <div class="demo-drawer__footer operate-module-three-footer">
          <el-button @click="confirmClose" size="large">取消</el-button>
          <el-button type="primary" @click="submit" size="large"
            >确认</el-button
          >
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { ROCK_LEVEL, MODULE_TYPE } from '../../enum/module'
import {
  operateModule,
  getModuleList,
  getModuleDetailById
} from '../../api/module'
import { ElMessageBox, ElMessage } from 'element-plus'

export default {
  name: 'LevelThreeModule',
  data() {
    return {
      // 模块类型
      moduleTypeList: MODULE_TYPE,
      dialogVisible: false,
      queryForm: {},
      isLoading: false,
      list: [],
      action: 'add',
      listMeta: [
        {
          label: '模块ID',
          prop: 'moduleId'
        },
        {
          label: '模块名称',
          prop: 'moduleName'
        },
        {
          label: '模块类型',
          prop: 'moduleType',
          formatter(row, column, cellValue) {
            if (cellValue) {
              return MODULE_TYPE[cellValue]
            }

            return cellValue
          }
        },
        {
          label: '模块来源',
          prop: 'from'
        },
        {
          label: '施工方法',
          prop: 'constrMethod'
        },
        {
          label: '围岩等级',
          prop: 'rockLevel',
          formatter(row, column, cellValue) {
            return ROCK_LEVEL[cellValue]
          }
        }
      ],
      total: 0,
      page: {
        pageSize: 10,
        pageNum: 1
      },
      // 保存条件搜索后的数据
      parForm: {},
      // 表单类
      // 增加和编辑二级模块的表单
      form: {
        moduleName: '',
        constrMethod: '',
        rockLevel: '',
        moduleType: 1,
        // 一个临时变量 用于保存子元素的字符串
        childrenStr: '',
        children: [],
        moduleLevel: 2,
        remark: '',
        planLastTime: 0,
        monthForward: 0,
        cycleForward: 0,
        cycleTime: 0
      },
      // 操作三级模块表单的校验规则
      formRules: {
        moduleName: [
          {
            required: true,
            message: '请填写模块名称',
            trigger: 'blur'
          }
        ],
        constrMethod: [
          {
            required: true,
            message: '填写施工方法',
            trigger: 'blur'
          }
        ],
        rockLevel: [
          {
            required: true,
            message: '请选择围岩等级',
            trigger: 'blur'
          }
        ],
        remark: [
          {
            required: true,
            message: '备注不能为空',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    rockLevelList() {
      // 创建的时候不要 所有选项
      const list = []
      let i = 0
      for (let k in ROCK_LEVEL) {
        list[i] = ROCK_LEVEL[k]
        i++
      }
      return list
    }
  },
  // 监听的使用场景 我们需要监听某数组的变化 从而改变某个值
  watch: {
    // 只要表单中的子模块的数组变化， 我们就监听这种变化 并且将子模块数组字符串的值变成每个子模块的id
    'form.children': {
      handler(arr) {
        this.form.childrenStr = arr.map((item) => item.moduleId).join(',')
      },
      deep: true
    }
  },
  methods: {
    // 根据参数获取列表
    fetchLevelOneListByParams() {
      // 条件搜索的时候应该跳回第一页
      this.page.pageNum = 1
      const params = { ...this.queryForm, ...this.page }
      // 保存条件搜索的参数 方便分页
      this.parForm = { ...this.queryForm }
      this.fetchModuleList(params)
    },
    // 重置搜索表单
    resetQueryForm() {
      this.$refs['queryFormRef'].resetFields()
    },
    // 获取模块列表
    async fetchModuleList(params) {
      params.moduleLevel = 2
      this.isLoading = true
      try {
        const { page, list } = await getModuleList(params)
        this.list = list
        this.total = page.total
        this.isLoading = false
      } catch (err) {
        ElMessage.error(err)
        this.isLoading = false
      }
    },
    // 查看详情 根据 模块id 跳转到查看详情页面
    checkDetail(id) {
      this.$router.push({ name: 'moduleDetail', query: { id: id } })
    },
    // 编辑二级模块操作
    editModule(row) {
      this.action = 'edit'
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['formRef'].resetFields()
        this.form = {
          ...row
        }
      })
    },
    // 增加二级模块操作
    addModule() {
      this.action = 'add'
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['formRef'].resetFields()
        this.form.children = []
      })
    },
    // 删除二级模块
    deleteModule(row) {
      ElMessageBox.confirm('确认删除该模块', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'danger'
      })
        .then(async () => {
          try {
            const params = { moduleId: row.moduleId, action: 'delete' }
            const res = await operateModule(params)
            this.fetchModuleList({ ...this.parForm, ...this.page })
            ElMessage.success('删除模块成功')
          } catch (err) {
            ElMessage.error('操作失败')
          }
        })
        .catch(() => {})
    },
    // 是否关闭操作三级模块的对话框 防止误点
    confirmClose() {
      ElMessageBox.confirm('您尚未保存，是否退出此操作？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.dialogVisible = false
        })
        .catch(() => {})
    },
    // 提交模块操作
    submit() {
      this.$refs['formRef'].validate((valid) => {
        if (valid) {
          ElMessageBox.confirm('确定提交？', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(async () => {
              try {
                const params = { ...this.form }
                if (params.moduleType == 1) {
                  params.children = []
                  params.cycleForward = 0
                  params.cycleTime = 0
                  params.monthForward = 0
                }
                if (params.moduleType == 2) {
                  params.planLastTime = 0
                  // 存储的时候不能应该只存 id
                  params.children = params.children.map((item) => {
                    return item.moduleId
                  })
                }
                params.action = this.action
                params.from = this.$store.state.userInfo.project
                const res = await operateModule(params)
                this.fetchModuleList({ ...this.parForm, ...this.page })
                ElMessage.success('操作成功')
                this.dialogVisible = false
              } catch (err) {
                ElMessage.error(err)
              }
            })
            .catch(() => {
              ElMessage.info('您已取消此操作')
            })
        }
      })
    },
    // 分页时候的操作
    pageChange(num) {
      this.page.pageNum = num
      const params = { ...this.parForm, ...this.page }
      this.fetchModuleList(params)
    },
    // 推算计划时间
    async calcPlanLastTime() {
      try {
        const str = this.form.childrenStr

        if (str == '') return ElMessage.error('子模块id不能为空')
        if (!this.form.cycleForward > 0)
          return ElMessage.error('请输入循环进尺')
        const res = await getModuleDetailById({ id: str })
        this.form.children = []
        let totalTime = 0
        res.forEach((item) => {
          totalTime += item.cycleTime
          this.form.children.push(item)
        })
        this.form.cycleTime = totalTime
        this.form.monthForward = this.calcMonthForward(
          this.form.cycleForward,
          totalTime
        )
      } catch (err) {
        ElMessage.error(err)
      }
    },
    // 计算月进尺
    calcMonthForward(l, t) {
      let dayCycle = 54 / (t / 24)
      return parseInt(l * dayCycle * 30)
    }
  },
  mounted() {
    this.fetchModuleList({ ...this.page })
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
