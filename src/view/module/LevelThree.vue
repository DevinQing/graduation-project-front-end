<template>
  <div class="level-three-module-container">
    <div class="one-query-form">
      <el-card>
        <el-form
          :inline="true"
          :model="queryForm"
          class="demo-form-inline"
          ref="queryFormRef"
        >
          <el-form-item prop="moduleId">
            <el-input
              v-model="queryForm.moduleId"
              placeholder="请输入模块id"
            ></el-input>
          </el-form-item>
          <el-form-item prop="moduleName">
            <el-input
              v-model="queryForm.moduleName"
              placeholder="请输入模块名称"
            ></el-input>
          </el-form-item>
          <el-form-item prop="constrMethod">
            <el-input
              v-model="queryForm.constrMethod"
              placeholder="请输入施工方法"
            ></el-input>
          </el-form-item>
          <el-form-item prop="rockLevel">
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
        <h1 class="title">三级模块列表</h1>

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
                <el-button size="small" @click="checkDetail(row)"
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
      :title="`${action == 'add' ? '新增' : '编辑'}三级模块`"
      :before-close="confirmClose"
      size="40%"
      :append-to-body="true"
      custom-class="operate-module-box"
    >
      <div class="demo-drawer__content">
        <el-form
          :model="form"
          style="width: 85%; padding-bottom: 80px"
          ref="formRef"
          :rules="formRules"
        >
          <el-form-item label="模块名称" prop="moduleName">
            <el-input
              v-model="form.moduleName"
              placeholder="请填写模块名称"
            ></el-input>
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
          <el-form-item label="循环时间" prop="cycleTime">
            <div style="margin-top: 10px">
              <div
                v-for="(item, index) in form.children"
                :key="index"
                class="cycle-time-item"
              >
                <span>{{ item.moduleName }}</span>
                <span>{{ item.time }}min</span>
                <span
                  ><el-icon
                    @click="deleteCircleTimeItem(index)"
                    class="delete-circle-time-icon"
                    ><circle-close /></el-icon
                ></span>
              </div>
              <div class="add-circle-time">
                <el-icon class="add-circle-time-icon" @click="addCircleTime"
                  ><circle-plus
                /></el-icon>
              </div>
              <div>
                <span>共计：</span>
                <span>{{ form.cycleTime }} </span>
                <span> (单位：min)</span>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="循环进尺" prop="cycleForward">
            <el-input-number v-model="form.cycleForward" :step="10" />
            <span>（单位：m）</span>
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

    <!-- 增加循环时间对话框 -->
    <el-dialog
      v-model="addCircleTimeDialogVisible"
      title="增加循环时间"
      width="30%"
      center
    >
      <el-form
        :model="addCircleTimeForm"
        class="demo-form-inline"
        ref="addCircleTimeFormRef"
        style="width: 80%"
        :rules="addCircleTimeFormRules"
      >
        <el-form-item prop="moduleName" label="名称">
          <el-input
            v-model="addCircleTimeForm.moduleName"
            placeholder="请输入循环项名称"
          ></el-input>
        </el-form-item>
        <el-form-item prop="time" label="时间">
          <el-input-number v-model="addCircleTimeForm.time" :step="10" />
          <span>（单位：min）</span>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addCircleTimeDialogVisible = false"
            >取消</el-button
          >
          <el-button type="primary" @click="addCircleTimeItem">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ROCK_LEVEL } from '../../enum/module'
import { operateModule, getModuleList } from '../../api/module'
import { ElMessageBox, ElMessage } from 'element-plus'

export default {
  name: 'LevelThreeModule',
  data() {
    return {
      dialogVisible: false,
      addCircleTimeDialogVisible: false,
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
          label: '模块名',
          prop: 'moduleName'
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
        },
        {
          label: '循环时间',
          prop: 'cycleTime',
          formatter(row, column, cellValue) {
            return cellValue + 'min'
          }
        },
        {
          label: '循环进尺',
          prop: 'cycleForward',
          formatter(row, column, cellValue) {
            return cellValue + 'm'
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
      // 增加和编辑三级模块的表单
      form: {
        moduleName: '',
        constrMethod: '',
        rockLevel: '',
        cycleTime: 0,
        children: [],
        cycleForward: 0,
        moduleLevel: 3,
        remark: ''
      },
      // 增加三级模块循环时间项的表单
      addCircleTimeForm: {
        moduleName: '',
        time: 0
      },
      // 增加三级模块循环时间项的表单的校验规则
      addCircleTimeFormRules: {
        moduleName: [
          {
            required: true,
            message: '请填写循环项名称',
            trigger: 'blur'
          }
        ],
        time: [
          {
            required: true,
            message: '请填写循环项时间',
            trigger: 'blur'
          }
        ]
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
        cycleTime: [
          {
            required: true,
            message: '循环时间必须大于0',
            trigger: 'blur'
          },
          {
            type: 'number',
            min: 1,
            message: '循环时间必须大于0',
            trigger: 'blur'
          }
        ],
        cycleForward: [
          {
            required: true,
            message: '循环进尺不能为空',
            trigger: 'blur'
          },
          {
            type: 'number',
            min: 1,
            message: '循环进尺必须大于0',
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
    // 这种场景下我采用了深度监听！
    'form.children': {
      handler(arr) {
        let res = 0
        arr.forEach((item) => {
          res = res + item.time
        })
        this.form.cycleTime = res
      },
      deep: true
    }
  },
  methods: {
    fetchLevelOneListByParams() {
      // 条件搜索的时候应该跳回第一页
      this.page.pageNum = 1
      const params = { ...this.queryForm, ...this.page }
      // 保存条件搜索的参数 方便分页
      this.parForm = { ...this.queryForm }
      this.fetchModuleList(params)
    },
    resetQueryForm() {
      this.$refs['queryFormRef'].resetFields()
    },
    // 获取模块列表
    async fetchModuleList(params) {
      params.moduleLevel = 3
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
    checkDetail(row) {
      const id = row.moduleId
      this.$router.push({ path: 'detail', query: { id: id } })
    },
    // 编辑三级模块操作
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
    // 增加三级模块操作
    addModule() {
      this.action = 'add'
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['formRef'].resetFields()
        this.form.children = []
      })
    },
    // 删除三级模块
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
    // 增加循环项窗口开启
    addCircleTime() {
      this.addCircleTimeDialogVisible = true
      this.$nextTick(() => {
        this.$refs['addCircleTimeFormRef'].resetFields()
      })
    },
    // 增加循环项目
    addCircleTimeItem() {
      this.$refs['addCircleTimeFormRef'].validate((valid) => {
        if (valid) {
          const params = { ...this.addCircleTimeForm }
          this.form.children.push(params)
          this.addCircleTimeDialogVisible = false
        }
      })
    },
    deleteCircleTimeItem(index) {
      this.form.children.splice(index, 1)
    },
    // 分页时候的操作
    pageChange(num) {
      this.page.pageNum = num
      const params = { ...this.parForm, ...this.page }
      this.fetchModuleList(params)
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
