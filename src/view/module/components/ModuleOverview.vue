<template>
  <div>
    <div class="add-btn" v-if="data.moduleLevel !== 1">
      <el-button type="primary" @click="addModule(id)" size="large"
        >引用并创建模块</el-button
      >
    </div>
    <div class="module-overview-container">
      <div class="information-content">
        <el-card>
          <el-descriptions
            class="margin-top"
            title="模块信息"
            :column="2"
            size="large"
          >
            <el-descriptions-item
              v-for="item in cptListMeta"
              :key="item.label"
              :label="item.label"
              label-class-name="info-label"
              >{{
                item.format
                  ? item.format(parData[item.value])
                  : parData[item.value]
              }}</el-descriptions-item
            >
          </el-descriptions>
          <el-descriptions
            style="margin-top: 15px"
            class="margin-top"
            title="备注信息"
            :column="1"
            size="large"
          >
            <el-descriptions-item label-class-name="info-label">{{
              parData.remark
            }}</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </div>
      <div class="tree-content">
        <el-card>
          <el-descriptions
            class="margin-top"
            title="模块树"
            :column="1"
            size="large"
          >
            <el-descriptions-item label-class-name="info-label" label="说明">
              展示该模块所包含的子模块
            </el-descriptions-item>
            <el-descriptions-item label-class-name="info-label">
              <el-tree :data="[parData]" :props="defaultProps">
                <template #default="{ data }">
                  <div class="cycle-treenode" v-if="data.moduleId">
                    <span class="module-level">{{ data.moduleLevel }}</span>
                    <span>{{ data.moduleName }}</span>
                    <span class="check-detail" @click="checkDetail(data)"
                      >查看详情</span
                    >
                  </div>
                  <div class="cycle-treenode" v-else>
                    <span>循环项</span>
                    <span>{{ data.moduleName }}</span>
                    <span>{{ data.time }}min</span>
                    <span></span>
                  </div> </template
              ></el-tree>
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { keepDecimal } from '@/utils/utils'
import { ElMessageBox, ElMessage } from 'element-plus'
import { operateModule } from '@/api/module'

export default {
  name: 'ModuleOverview',
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      listMeta: [
        {
          label: '模块Id',
          value: 'moduleId',
          show() {
            return true
          }
        },
        {
          label: '创建时间',
          value: 'createTime',
          format(val) {
            return moment(val).format('YYYY-MM-DD hh:mm:ss')
          },
          show() {
            return true
          }
        },
        {
          label: '最后修改时间',
          value: 'lastUpdateTime',
          format(val) {
            return moment(val).format('YYYY-MM-DD hh:mm:ss')
          },
          show() {
            return true
          }
        },
        {
          label: '模块名称',
          value: 'moduleName',
          show() {
            return true
          }
        },
        {
          label: '模块等级',
          value: 'moduleLevel',
          format: (val) => {
            return {
              1: '一级',
              2: '二级',
              3: '三级'
            }[val]
          },
          show() {
            return true
          }
        },
        {
          label: '模块类型',
          value: 'moduleType',
          format: (val) => {
            return {
              1: '普通模块',
              2: '循环模块'
            }[val]
          },
          show(item) {
            return item.moduleLevel === 2
          }
        },
        {
          label: '施工方法',
          value: 'constrMethod',
          show() {
            return true
          }
        },
        {
          label: '围岩等级',
          value: 'rockLevel',
          format: (val) => {
            return {
              1: 'I级',
              2: 'Ⅱ级',
              3: 'Ⅲ级',
              4: 'Ⅳ级',
              5: 'Ⅴ级'
            }[val]
          },
          show() {
            return true
          }
        },
        {
          label: '循环时间',
          value: 'cycleTime',
          format(val) {
            return keepDecimal(val / 60, 1) + 'h'
          },
          show(item) {
            if (item.moduleLevel === 3 || item.moduleType === 2) return true
            return false
          }
        },
        {
          label: '循环进尺',
          value: 'cycleForward',
          format(val) {
            return val + 'm'
          },
          show(item) {
            if (item.moduleType == 2) {
              return true
            } else {
              return false
            }
          }
        },
        {
          label: '模块来源',
          value: 'from',
          show() {
            return true
          }
        },
        {
          label: '计划持续时间',
          value: 'planLastTime',
          format(val) {
            return val + 'd'
          },
          show(item) {
            if (item.moduleType === 1) return true
            return false
          }
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'moduleName'
      }
    }
  },
  methods: {
    check(node) {
      console.log(node)
    },
    checkDetail(data) {
      this.$router.push({ name: 'moduleDetail', query: { id: data.moduleId } })
    },
    addModule() {
      ElMessageBox.confirm('确定引用并创建一个新模块？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          try {
            const params = { ...this.data }
            params.action = 'add'
            params.createTime = Date.now()
            params.from = this.$store.state.userInfo.project
            const res = await operateModule(params)

            if (params.moduleLevel === 2 && params.children.length > 0) {
              // 如果等于二 则需要创建多个模块
              // 这个之后再处理
            }
            ElMessageBox.alert(
              `创建成功！ 模块Id为 <strong style="color: red;">${res.moduleId}</strong>，模块名为 <strong style="color: red;">${res.moduleName}</strong>`,
              {
                dangerouslyUseHTMLString: true
              }
            )
          } catch (err) {
            console.log(err)
            ElMessage.error(err)
          }
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '您已取消该操作'
          })
        })
    }
  },
  computed: {
    parData() {
      return { ...this.data }
    },
    cptListMeta() {
      return this.listMeta.filter((item) => {
        return item.show(this.parData)
      })
    }
  },
  mounted() {}
}
</script>

<style lang="scss">
.module-overview-container {
  height: 100%;
  h1 {
    padding: 20px 0;
    font-size: 20px;
    font-weight: 600;
  }
  & > div {
    padding: 20px;
  }
  display: flex;
  justify-content: space-between;
  .info-label {
    font-weight: 600;
  }
  .information-content {
    flex: 0.9;
  }
  .tree-content {
    flex: 0.9;
    .cycle-treenode {
      display: flex;
      align-items: center;
      width: 100%;
      .module-level {
        flex: 0.2;
        font-weight: 600;
        color: #336699;
      }
      .check-detail {
        font-size: 12px;
        font-weight: 600;
        &:hover {
          cursor: pointer;
          color: #3f9eff;
        }
      }
      & > span {
        flex: 1;
      }
    }
  }
}
</style>
