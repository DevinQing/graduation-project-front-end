<template>
  <div class="userInfo-container">
    <div class="query-user-form">
      <el-card>
        <el-form
          :inline="true"
          :model="queryForm"
          class="demo-form-inline"
          ref="queryFromRef"
        >
          <el-form-item prop="userName">
            <el-input
              v-model="queryForm.userName"
              placeholder="请输入用户姓名"
            ></el-input>
          </el-form-item>
          <el-form-item prop="role">
            <el-select v-model="queryForm.role" placeholder="请选择用户职位">
              <el-option
                v-for="item in roleList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="state">
            <el-select v-model="queryForm.state" placeholder="请选择用户状态">
              <el-option
                v-for="item in stateList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="fetchUserListByParams"
              >查询</el-button
            >
          </el-form-item>
          <el-form-item>
            <el-button @click="resetQueryForm">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
    <div class="user-table">
      <el-card>
        <div class="add-user">
          <el-button type="primary" @click="addUser">新增用户</el-button>
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
                <el-button size="small" @click="editUser(row)">编辑</el-button>
                <el-button size="small" type="danger" @click="deleteUser(row)"
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
              :page-size="page.pageSize"
              @current-change="pageChange"
            >
            </el-pagination>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 新增编辑用户对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="`${this.action == 'add' ? '新增' : '编辑'}用户`"
      width="40%"
      custom-class="dialog-box"
    >
      <el-form
        ref="formRef"
        :model="form"
        label-width="80px"
        style="padding: 0 40px"
        :rules="rule"
      >
        <el-form-item label="用户姓名" prop="userName">
          <el-input
            v-model="form.userName"
            placeholder="请输入用户姓名"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户年龄" prop="age">
          <el-input-number v-model="form.age" :min="1" :max="100" />
        </el-form-item>

        <el-form-item label="用户性别" prop="sex">
          <el-radio-group v-model="form.sex">
            <el-radio :label="0">男</el-radio>
            <el-radio :label="1">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="用户职位" prop="role">
          <el-radio-group v-model="form.role">
            <el-radio :label="1">管理人员</el-radio>
            <el-radio :label="2">研究人员</el-radio>
            <el-radio :label="3">技术人员</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="用户状态" prop="state">
          <el-radio-group v-model="form.state">
            <el-radio :label="1">在职</el-radio>
            <el-radio :label="2">兼职</el-radio>
            <el-radio :label="3">离职</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="联系方式"
          prop="mobile"
          placeholder="请输入用户电话"
        >
          <el-input v-model="form.mobile"></el-input>
        </el-form-item>
        <el-form-item
          label="所属项目"
          prop="project"
          placeholder="请输入用户所属项目"
        >
          <el-input v-model="form.project"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submit">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
const roleList = [
  {
    value: 0,
    label: '所有'
  },
  {
    value: 1,
    label: '管理人员'
  },
  {
    value: 2,
    label: '研究人员'
  },
  {
    value: 3,
    label: '技术人员'
  }
]
const stateList = [
  {
    value: 0,
    label: '所有'
  },
  {
    value: 1,
    label: '在职'
  },
  {
    value: 2,
    label: '兼职'
  },
  {
    value: 3,
    label: '离职'
  }
]
import { ElMessage, ElMessageBox } from 'element-plus'
import { getUserList, operateUser } from '../../api/users'
export default {
  name: 'UserInfo',
  data() {
    return {
      isLoading: false,
      // 用户职位字典
      roleList: roleList,
      // 用户状态字典
      stateList: stateList,
      // 查询用户表单数据
      queryForm: {
        userName: '',
        role: '',
        state: ''
      },
      dialogVisible: false,
      // 操作用户表单
      form: {
        userName: '',
        age: 1,
        sex: 0,
        role: 2,
        mobile: '',
        project: '',
        state: 0
      },
      // 操作用户的表单验证
      rule: {
        userName: [
          {
            required: true,
            message: '请填写用户姓名',
            trigger: 'blur'
          }
        ],
        age: [
          {
            required: true,
            message: '请填写用户年龄',
            trigger: 'blur'
          }
        ],
        sex: [
          {
            required: true,
            message: '请选择用户性别',
            trigger: 'blur'
          }
        ],
        role: [
          {
            required: true,
            message: '请选择用户职位',
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            required: true,
            message: '请输入用户电话',
            trigger: 'blur'
          }
        ],
        project: [
          {
            required: true,
            message: '请输入用户所属项目',
            trigger: 'blur'
          }
        ]
      },
      page: {
        pageNum: 1,
        pageSize: 10
      },
      action: 'add',
      list: [],
      listMeta: [
        {
          prop: 'userName',
          label: '姓名'
        },
        {
          prop: 'role',
          label: '角色',
          formatter(row, column, cellValue) {
            return {
              1: '管理人员',
              2: '研究人员',
              3: '技术人员'
            }[cellValue]
          }
        },
        {
          prop: 'age',
          label: '年龄'
          //   formatter(row, column, cellValue) {
          //     return {
          //       0: '管理员',
          //       1: '普通用户'
          //     }[cellValue]
          //   }
        },
        {
          prop: 'sex',
          label: '性别',
          formatter(row, column, cellValue) {
            return {
              0: '男',
              1: '女'
            }[cellValue]
          }
        },
        {
          prop: 'mobile',
          label: '电话'
        },
        {
          prop: 'project',
          label: '所属项目'
        },
        {
          prop: 'state',
          label: '状态',
          formatter(row, column, cellValue) {
            return {
              1: '在职',
              2: '兼职',
              3: '离职'
            }[cellValue]
          }
        }
      ],
      total: 0,
      pageParams: {}
    }
  },
  methods: {
    // 重置用户搜索表单
    resetQueryForm() {
      this.$refs['queryFromRef'].resetFields()
    },
    // 新增用户打开窗口
    addUser() {
      this.action = 'add'
      this.dialogVisible = true
      this.$nextTick(() => {
        this.form = {
          userName: '',
          age: 1,
          sex: 0,
          role: 3,
          mobile: '',
          project: '',
          state: 1
        }
        this.$refs['formRef'].resetFields()
      })
    },
    // 编辑用户窗口打开
    editUser(row) {
      this.action = 'edit'
      this.dialogVisible = true
      this.$nextTick(() => {
        this.form = {
          ...row
        }
        this.$refs['formRef'].resetFields()
      })
    },
    // 删除用户
    deleteUser(row) {
      ElMessageBox.confirm('确定删除该用户？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'danger'
      })
        .then(async () => {
          try {
            this.action = 'delete'
            const params = {
              action: this.action,
              userId: row.userId
            }
            await operateUser(params)
            ElMessage.success('删除成功')
            this.fetchUserList({ ...this.pageParams, ...this.page })
          } catch (err) {
            return fasle
          }
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '取消删除'
          })
        })
    },
    // 提交操作用户表单
    submit() {
      this.$refs['formRef'].validate((valid) => {
        if (valid) {
          ElMessageBox.confirm('确定执行此操作?', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'success'
          })
            .then(async () => {
              try {
                const params = {
                  ...this.form
                }
                params.action = this.action
                const res = await operateUser(params)
                this.fetchUserList({ ...this.pageParams, ...this.page })
                ElMessage.success(
                  `用户${this.action === 'add' ? '创建' : '编辑'}成功`
                )
                this.dialogVisible = false
              } catch (err) {
                return false
              }
            })
            .catch(() => {
              ElMessage({
                type: 'info',
                message: '您已取消操作'
              })
            })
        }
      })
    },
    // 获取用户列表
    async fetchUserList(params) {
      this.isLoading = true
      try {
        const { list, page } = await getUserList(params)
        this.list = list
        this.total = page.total
        this.isLoading = false
      } catch (err) {
        this.isLoading = false
      }
    },
    // 条件搜索
    fetchUserListByParams() {
      this.page.pageNum = 1
      const params = { ...this.queryForm, ...this.page }
      // 翻页的时候也用该参数请求
      this.pageParams = { ...this.queryForm }
      this.fetchUserList(params)
    },
    // 分页时候的操作
    pageChange(num) {
      this.page.pageNum = num
      const params = { ...this.pageParams, ...this.page }
      this.fetchUserList(params)
    }
  },
  mounted() {
    this.fetchUserList({ pageNum: 1, pageSize: 10 })
  }
}
</script>

<style lang="scss" scoped>
.userInfo-container {
  .query-user-form {
    margin-bottom: 15px;
  }
  .user-table {
    .add-user {
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
