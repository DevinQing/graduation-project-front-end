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
        <h1 class="title">一级模块列表</h1>

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
      :title="`${action == 'add' ? '新增' : '编辑'}一级模块`"
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
          <el-form-item label="子模块Id" prop="childrenStr">
            <div class="last-time-calc">
              <el-input
                v-model="form.childrenStr"
                placeholder="请输入子模块ID,用英文逗号隔开"
              >
              </el-input>
            </div>
          </el-form-item>
          <el-form-item label="子模块列表" v-if="action == 'edit'">
            <ul class="son-module-list">
              <li v-for="item in form.children" :key="item.moduleId">
                <span>{{ item.moduleName }}</span>
                <span>{{ moduleTypeList[item.moduleType] }}</span>
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
        // 一个临时变量 用于保存子元素的字符串
        childrenStr: '',
        children: [],
        moduleLevel: 1,
        remark: ''
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
        ],
        childrenStr: [
          {
            required: true,
            message: '一级模块必须包含二级子模块',
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
      params.moduleLevel = 1
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
                params.children = params.childrenStr.split(',')
                params.action = this.action
                params.from = this.$store.state.userInfo.project
                console.log(params)
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
