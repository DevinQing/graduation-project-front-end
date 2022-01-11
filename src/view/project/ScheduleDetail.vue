<template>
  <div class="schedule-detail-container">
    <div class="top-content">
      <el-button size="large" @click="backLast">返回</el-button>
      <h1 v-if="action !== 'check'">
        {{ action == 'add' ? '创建' : '编辑' }}进度任务
      </h1>
      <div v-if="action !== 'check'">
        <el-button size="large" @click="reset(action)">重置</el-button>
        <el-button type="success" size="large" @click="submit"
          >保存并提交</el-button
        >
      </div>
    </div>

    <div class="main">
      <div class="left-content">
        <el-card>
          <h1>基本信息</h1>
          <div class="form-content">
            <el-form
              ref="formRef"
              :model="form"
              label-width="100px"
              style="width: 90%"
              :rules="formRules"
              :disabled="disabled"
            >
              <el-form-item
                label="任务ID"
                v-if="action !== 'add'"
                prop="scheduleId"
              >
                <el-input disabled v-model="form.scheduleId"></el-input>
              </el-form-item>
              <el-form-item label="任务名程" prop="scheduleName">
                <el-input
                  v-model="form.scheduleName"
                  placeholder="请输入进度任务名称"
                ></el-input>
              </el-form-item>
              <el-form-item label="任务状态" prop="state">
                <el-radio-group v-model="form.state">
                  <el-radio :label="1">未开始</el-radio>
                  <el-radio :label="2">进行中</el-radio>
                  <el-radio :label="3">已完成</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="桩号" prop="station">
                <el-input
                  v-model="form.station"
                  placeholder="请输入进度任务桩号"
                ></el-input>
              </el-form-item>
              <el-form-item label="任务总长" prop="length">
                <el-input-number v-model="form.length" :min="0" /><span
                  >（单位: 米）</span
                >
              </el-form-item>
              <el-form-item label="引用模块" prop="refer">
                <div class="input-and-btn">
                  <el-input
                    v-model="form.refer"
                    placeholder="请输入引用一级模块id"
                  ></el-input>
                  <el-button @click="referAndCal">引入并计算</el-button>
                </div>
              </el-form-item>
              <el-form-item label="开始时间" prop="startTime">
                <el-date-picker
                  v-model="form.startTime"
                  type="date"
                  placeholder="请选择任务开始日期"
                  value-format="YYYY-MM-DD"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item label="结束时间" prop="endTime">
                <el-date-picker
                  v-model="form.endTime"
                  type="date"
                  placeholder="请选择任务结束日期"
                  value-format="YYYY-MM-DD"
                >
                </el-date-picker>
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
          </div>
        </el-card>
      </div>
      <div class="right-content">
        <el-card>
          <div class="operate-btn">
            <el-button type="primary" @click="checkGantt"
              >查看进度甘特图</el-button
            >
          </div>
          <el-collapse v-model="activeNames">
            <el-collapse-item name="plan">
              <template #title>
                <span style="margin-right: 20px">计划进度表</span>
                <el-button
                  size="mini"
                  @click.stop="exportex(form.planSchedule, '计划进度表')"
                  >导出excel</el-button
                >
              </template>

              <el-table
                :data="form.planSchedule"
                style="width: 100%"
                border
                stripe
              >
                <el-table-column label="ID" prop="id" align="center">
                </el-table-column>
                <el-table-column
                  label="名称"
                  prop="text"
                  align="center"
                ></el-table-column>
                <el-table-column
                  label="开始时间"
                  prop="start_date"
                  width="150"
                  align="center"
                >
                  <template #default="{ row }">
                    <div class="time-picker-par">
                      <el-date-picker
                        v-model="row.start_date"
                        type="date"
                        value-format="YYYY-MM-DD"
                        format="YYYY-MM-DD"
                        @change="startTimeChange(row)"
                        :disabled="disabled"
                      >
                      </el-date-picker>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  label="持续时间(天)"
                  prop="duration"
                  align="center"
                >
                  <template #default="{ row }">
                    <el-input
                      :disabled="disabled"
                      v-model.number="row.duration"
                    />
                  </template>
                </el-table-column>
                <el-table-column
                  label="结束时间"
                  prop="end_date"
                  width="150"
                  align="center"
                >
                  <template #default="{ row }">
                    <div class="time-picker-par">
                      <el-date-picker
                        v-model="row.end_date"
                        type="date"
                        value-format="YYYY-MM-DD"
                        :disabled="disabled"
                      >
                      </el-date-picker>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </el-collapse-item>
            <el-collapse-item name="actual">
              <template #title>
                <span style="margin-right: 20px">实际进度表</span>
                <el-button
                  size="mini"
                  @click.stop="exportex(form.actualSchedule, '实际进度表')"
                  >导出excel</el-button
                >
              </template>
              <el-table
                :data="form.actualSchedule"
                style="width: 100%"
                border
                stripe
              >
                <el-table-column label="ID" prop="id" align="center">
                </el-table-column>
                <el-table-column
                  label="名称"
                  prop="text"
                  align="center"
                ></el-table-column>
                <el-table-column
                  label="开始时间"
                  prop="start_date"
                  width="150"
                  align="center"
                >
                  <template #default="{ row }">
                    <div class="time-picker-par">
                      <el-date-picker
                        v-model="row.start_date"
                        type="date"
                        value-format="YYYY-MM-DD"
                        format="YYYY-MM-DD"
                        @change="startTimeChange(row)"
                        :disabled="disabled"
                      >
                      </el-date-picker>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  label="持续时间(天)"
                  prop="duration"
                  align="center"
                >
                  <template #default="{ row }">
                    <el-input
                      :disabled="disabled"
                      v-model.number="row.duration"
                    />
                  </template>
                </el-table-column>
                <el-table-column
                  label="结束时间"
                  prop="end_date"
                  width="150"
                  align="center"
                >
                  <template #default="{ row }">
                    <div class="time-picker-par">
                      <el-date-picker
                        v-model="row.end_date"
                        type="date"
                        value-format="YYYY-MM-DD"
                        :disabled="disabled"
                      >
                      </el-date-picker>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </el-collapse-item>
          </el-collapse>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import { operateSchedule, getDetailById } from '@/api/schedule'
import { getModuleDetailById } from '@/api/module'
import { ElMessage, ElMessageBox } from 'element-plus'
import { addDays } from '../../utils/utils'
import _ from 'lodash'

// 导出 excel 表
import exportExcel from '../../utils/exportExcel'
export default {
  name: 'ScheduleDetail',

  data() {
    return {
      // 折叠面板的展开项目
      activeNames: 'plan',
      action: 'add',
      data: {},
      // 保存一下请求之后的原始数据
      rawData: {},
      // 操作进度任务表单数据
      form: {
        scheduleId: '',
        scheduleName: '',
        station: '',
        state: 1,
        length: 0,
        moduleData: {},
        startTime: '',
        endTime: '',
        refer: '',
        // 实际进度表
        actualSchedule: [],
        // 计划进度表
        planSchedule: []
      },
      // 操作进度任务表单校验规则
      formRules: {
        scheduleName: [
          {
            required: true,
            message: '进度任务名称不能为空',
            trigger: 'blur'
          }
        ],
        station: [
          {
            required: true,
            message: '进度任务桩号不能为空',
            trigger: 'blur'
          }
        ],
        length: [
          { required: true, message: '进度任务总长不能为空', trigger: 'blur' },
          { type: 'number', message: '进度任务总长必须为数字', trigger: 'blur' }
        ],
        refer: [
          {
            required: true,
            message: '引用模块不能id不能为空',
            trigger: 'blur'
          }
        ],
        remark: [
          {
            required: true,
            message: '备注信息不能为空',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    exportex(data, fileName) {
      if (!data.length > 0) return ElMessage.error('无数据')
      let fields = {
        id: '施工活动id',
        text: '施工活动名称',
        start_date: '开始时间',
        duration: '持续时间',
        end_date: '结束时间'
      }
      // let data = JSON.parse(JSON.stringify(this.form.planSchedule)) // 如果直接放置数据不行请加上这句
      const d = _.cloneDeep(data)
      exportExcel(d, fields, fileName)
      // console.log(this.form.planSchedule)
    },
    // 初始化从跳转页面来的信息
    async init() {
      this.action = this.$route.query.action
      // this.data = this.$route.params.data
      const id = this.$route.query.id
      if (id != 0) {
        const res = await getDetailById({ id: id })
        this.rawData = res[0]
        this.form = _.cloneDeep(this.rawData)
      }
    },
    // 重置该表单
    reset(type) {
      if (type === 'add') {
        this.$nextTick(() => {
          this.form.planSchedule = []
          this.form.actualSchedule = []
          this.$refs['formRef'].resetFields()
        })
      } else if (type == 'edit') {
        this.form = _.cloneDeep(this.rawData)
        // this.$refs['formRef'].resetFields()
      }
    },
    // 返回上一级
    backLast() {
      this.$router.go(-1)
    },
    submit() {
      this.$refs['formRef'].validate((valid) => {
        if (valid) {
          ElMessageBox.confirm('确认完成该进度任务的操作？', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(async () => {
              try {
                const params = {
                  ...this.form
                }
                params.action = this.action
                console.log(params)
                const res = await operateSchedule(params)
                ElMessage.success('操作成功')
                // this.$router.push({ name: 'projectProgress' })
              } catch (err) {
                ElMessage.error(err)
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
    // 查看甘特图
    checkGantt() {
      this.$store.commit('setGanttData', {
        planData: {
          data: this.form.planSchedule
          // links: [{ id: 1, source: 1, target: 2, type: '0' }]
        },
        actualData: {
          data: this.form.actualSchedule
        }
      })
      this.$router.push({
        name: 'ganttDetail'
      })
    },
    // 引用模块 id 并且计算
    async referAndCal() {
      if (this.form.length <= 0) return ElMessage.error('进度任务总长不能为 0')
      if (this.form.refer == '')
        return ElMessage.error('请填写引入一级模块的 id')

      try {
        const id = this.form.refer
        const res = await getModuleDetailById({ id: id })
        this.moduleData = res[0]
        if (this.moduleData.moduleLevel !== 1) {
          return ElMessage.info('请引入一级模块')
        }
        const list = this.getPlanList(this.moduleData.children)
        this.form.planSchedule = list.plan
        this.form.actualSchedule = list.actual
      } catch (err) {
        ElMessage.error(err)
      }
    },
    // 将所有的二级模块转化为时间参数
    getPlanList(list) {
      if (!Array.isArray(list)) return []
      const len = this.form.length
      const res = {
        plan: [],
        actual: []
      }
      list.forEach((item) => {
        let duration
        if (item.moduleType == 1) {
          duration = item.planLastTime
        } else {
          duration = parseInt((len * 30) / item.monthForward)
        }
        res.plan.push({
          id: item.moduleId,
          text: item.moduleName,
          start_date: '',
          duration,
          end_date: ''
        })
        res.actual.push({
          id: item.moduleId,
          text: item.moduleName,
          start_date: '',
          duration: 0,
          end_date: '',
          color: '#6BC172'
        })
      })
      return res
    },
    // 当用户修改开始时间的时候
    startTimeChange(row) {
      row.end_date = addDays(row.start_date, row.duration)
      console.log(row)
    }
  },
  computed: {
    disabled() {
      return this.action === 'check'
    }
  },
  created() {
    this.init()
  }
}
</script>

<style lang="scss">
.input-and-btn {
  display: flex;
}
.schedule-detail-container {
  min-height: calc(100vh - 90px);
  background-color: #fff;
  .top-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 15px;
    h1 {
      text-align: center;
      font-weight: 700;
      font-size: 20px;
      color: #336699;
    }
  }

  .main {
    display: flex;

    .left-content {
      flex: 4;
      padding: 0 15px;
      h1 {
        font-weight: 600;
        text-align: center;
        padding: 0 10px 10px;
        font-size: 16px;
      }
      //   .form-content {
      //   }
    }
    .right-content {
      flex: 5;
      .operate-btn {
        padding: 0 0 15px 0;
      }
    }
  }
}
.time-picker-par {
  width: 100%;
  .el-input {
    width: 100%;
  }
}
</style>
