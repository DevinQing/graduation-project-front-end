<template>
  <div class="data-detail-container">
    <el-card>
      <el-menu
        default-active="delay"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
      >
        <el-menu-item index="delay">延期分析</el-menu-item>
      </el-menu>
      <div class="data-detail-content">
        <div class="delay-data-content">
          <el-collapse v-model="activeNames">
            <el-collapse-item title="数据表" name="table">
              <div class="operate-btn">
                <el-button @click="getDelayExcel(delayList, '延期数据表')"
                  >导出延期数据表</el-button
                >
                <div>
                  <!-- <el-button type="warning" @click="feedback"
                    >模块反馈</el-button
                  > -->
                  <el-button type="success" @click="saveData"
                    >保存数据</el-button
                  >
                </div>
              </div>
              <el-table
                v-loading="isLoading"
                :data="delayList"
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
                <el-table-column label="操作" align="center" width="160">
                  <template #default="{ row, $index }">
                    <el-button size="small" @click="edit(row, $index)"
                      >编辑</el-button
                    >
                    <el-button
                      size="small"
                      type="danger"
                      @click="deleteRow(row, $index)"
                      >删除</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
            </el-collapse-item>
            <el-collapse-item title="数据图" name="histogram">
              <div class="echarts-box">
                <div class="histogram-box">
                  <histogram :data="histogramData"></histogram>
                </div>
                <div class="pie-box">
                  <pie-chart :data="pieChartData"></pie-chart>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
    </el-card>

    <!-- 编辑延期对话框 -->
    <el-dialog v-model="dialogVisible" title="编辑" width="30%">
      <el-form
        ref="formRef"
        :model="form"
        label-width="80px"
        style="padding: 0 40px"
      >
        <el-form-item label="计划天数" prop="planTime">
          <el-input-number v-model="form.planTime" :min="1" /><span
            >（单位:天）</span
          >
        </el-form-item>
        <el-form-item label="实际天数" prop="actualTime">
          <el-input-number v-model="form.actualTime" :min="1" /><span
            >（单位:天）</span
          >
        </el-form-item>
        <el-form-item label="延期天数" prop="delayTime">
          <el-input-number v-model="form.delayTime" :min="1" /><span
            >（单位:天）</span
          >
        </el-form-item>
        <el-form-item label="延期率" prop="actualTime">
          <el-input v-model="form.delayRate" />
        </el-form-item>
        <el-form-item label="延期原因" prop="cause">
          <el-select v-model="form.cause" multiple placeholder="请选择延期原因">
            <el-option
              v-for="(item, index) in delayCauseList"
              v-show="index > 0"
              :key="index"
              :label="item"
              :value="index"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="form.remark"
            :rows="5"
            type="textarea"
            placeholder="请填写备注"
          />
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
import { keepDecimal } from '@/utils/utils'
import { getDetailById } from '@/api/schedule'
import { ElMessage, ElMessageBox } from 'element-plus'
import { DELAY_CAUSE } from '@/enum/schedule'
import { operateSchedule } from '@/api/schedule'
import _ from 'lodash'
import Histogram from '@/components/Histogram.vue'
import PieChart from '@/components/PieChart.vue'

// 导出 excel 表
import exportExcel from '@/utils/exportExcel'
export default {
  name: 'DataDetail',
  components: {
    Histogram,
    PieChart
  },
  data() {
    return {
      delayCauseList: DELAY_CAUSE,
      dialogVisible: false,
      menuIndex: 'delay',
      // 折叠组件打开
      activeNames: 'table',
      delayList: [],
      isLoading: false,
      listMeta: [
        {
          label: '模块ID',
          prop: 'id'
        },
        {
          label: '模块名称',
          prop: 'name'
        },
        {
          label: '计划天数（天）',
          prop: 'planTime'
        },
        {
          label: '实际天数（天）',
          prop: 'actualTime'
        },
        {
          label: '延期天数（天）',
          prop: 'delayTime'
        },
        {
          label: '延期率',
          prop: 'delayRate'
        },
        {
          label: '延期原因',
          prop: 'cause',
          formatter(row, column, cellValue) {
            return cellValue
              .map((item) => {
                return DELAY_CAUSE[item]
              })
              .toString()
          }
        },
        {
          label: '备注',
          prop: 'remark',
          formatter(row, column, cellValue) {
            return cellValue
          }
        }
      ],
      // 编辑延期率表单
      form: {},
      // 编辑的数据的 index
      index: 0
    }
  },
  methods: {
    // 菜单切换
    handleSelect(val) {
      this.menuIndex = val
    },
    async init() {
      this.isLoading = true
      try {
        const params = {
          id: this.$route.query.id
        }
        const res = await getDetailById(params)
        if (res[0].delay && res[0].delay.length > 0) {
          this.delayList = [
            ...res[0].delay,
            ...this.getMapList(res[0].planSchedule, res[0].actualSchedule)
          ]
          let arr = []
          let reArr = []
          this.delayList.forEach((item, index) => {
            if (!arr.includes(item.id)) {
              arr.push(item.id)
            } else {
              reArr.push(index)
            }
          })
          this.delayList = this.delayList.filter((item, index) => {
            return !reArr.includes(index)
          })
        } else {
          this.delayList = this.getMapList(
            res[0].planSchedule,
            res[0].actualSchedule
          )
        }
        console.log('原始数据得用', res[0])
        this.isLoading = false
      } catch (err) {
        this.isLoading = false
        ElMessage.error('信息获取失败')
      }
    },
    // 将数据映射成我们需要的数据格式
    getMapList(planList, actualList) {
      const res = []
      for (let i = 0; i < planList.length; i++) {
        if (planList[i].id !== actualList[i].id) {
          return ElMessage.info('计划数据与实际数据需要一一对应')
        }
        let delayTime = actualList[i].duration - planList[i].duration
        res.push({
          id: planList[i].id,
          name: planList[i].text,
          delayTime,
          planTime: planList[i].duration,
          actualTime: actualList[i].duration,
          delayRate: keepDecimal(delayTime / planList[i].duration, 2),
          cause: [],
          remark: '',
          from: this.$store.state.userInfo.project
        })
      }
      return res.filter((item) => {
        return item.delayTime > 0
      })
    },
    // 编辑某条数据
    edit(row, index) {
      this.form = _.cloneDeep(row)
      this.index = index
      this.dialogVisible = true
    },

    // 提交编辑
    submit() {
      this.delayList[this.index] = _.cloneDeep(this.form)
      this.dialogVisible = false
      console.log(this.delayList)
    },

    // 保存数据到数据库
    save() {},
    // 删除某条数据
    deleteRow(row, index) {
      ElMessageBox.confirm('确定删除该条数据', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      })
        .then(() => {
          this.delayList.splice(index, 1)
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '取消操作'
          })
        })
    },
    getDelayExcel(data, fileName) {
      if (!data.length > 0) return ElMessage.error('无数据')
      let fields = {
        name: '施工活动',
        planTime: '计划天数',
        actualTime: '实际天数',
        delayTime: '延期天数',
        delayRate: '延期率',
        cause: '延期原因',
        remark: '备注'
      }

      const d = _.cloneDeep(data)
      d.forEach((item) => {
        item.cause = item.cause
          .map((item) => {
            return this.delayCauseList[item]
          })
          .toString()
      })
      exportExcel(d, fields, fileName)
    },
    // 保存数据
    saveData() {
      ElMessageBox.confirm('确定保存延期数据表', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      })
        .then(async () => {
          try {
            const params = {
              action: 'edit',
              scheduleId: this.$route.query.id,
              delay: this.delayList
            }
            const res = await operateSchedule(params)
            ElMessage.success('操作成功')
          } catch (err) {
            ElMessage.error(err)
          }
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '取消操作'
          })
        })
      console.log('保存数据', this.delayList)
    },
    // 模块反馈
    feedback() {
      ElMessageBox.confirm('此操作将会把延期数据反馈到具体模块，确定继续？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          ElMessage({
            type: 'success',
            message: '操作成功'
          })
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '取消操作'
          })
        })
    }
  },
  computed: {
    histogramData() {
      const xData = this.delayList.map((item) => {
        return item.name
      })
      const yData = this.delayList.map((item) => {
        return item.delayTime
      })
      return {
        title: {
          text: '不同施工活动的延迟天数',
          subtext: '柱状图',
          left: 'center'
        },
        data: {
          xData,
          yData
        }
      }
    },
    pieChartData() {
      const map = {
        1: {
          plan: 0,
          delay: 0
        },
        2: {
          plan: 0,
          delay: 0
        },
        3: {
          plan: 0,
          delay: 0
        },
        4: {
          plan: 0,
          delay: 0
        },
        5: {
          plan: 0,
          delay: 0
        },
        6: {
          plan: 0,
          delay: 0
        },
        7: {
          plan: 0,
          delay: 0
        },
        8: {
          plan: 0,
          delay: 0
        }
      }
      this.delayList.forEach((item) => {
        for (let i = 0; i < item.cause.length; i++) {
          let reason = item.cause[i]
          map[reason].plan += item.planTime
          map[reason].delay += item.delayTime
        }
      })
      let myData = []
      for (let k in map) {
        if (map[k].plan > 0 && map[k].delay > 0) {
          myData.push({
            value: keepDecimal(map[k].delay / map[k].plan, 2),
            name: DELAY_CAUSE[k]
          })
        }
      }
      return {
        title: {
          text: '不同因素造成的延期率占比',
          subtext: '饼图',
          left: 'center'
        },
        data: myData
      }
    }
  },
  mounted() {
    this.init()
  }
}
</script>

<style lang="scss">
.data-detail-container {
  .data-detail-content {
    .delay-data-content {
      margin-top: 20px;
      .echarts-box {
        display: flex;
        & > div {
          width: 550px;
          height: 500px;
        }
      }
      .operate-btn {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
      }
    }
  }
}
</style>
