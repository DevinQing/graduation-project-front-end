<template>
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
            v-for="item in listMeta"
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
            <el-tree :data="parData.children" :props="defaultProps">
              <template #default="{ data }">
                <div class="cycle-treenode" v-if="!data.moduleId">
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
</template>

<script>
import moment from 'moment'
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
          value: 'moduleId'
        },
        {
          label: '创建时间',
          value: 'createTime',
          format(val) {
            return moment(val).format('YYYY-MM-DD hh:mm:ss')
          }
        },
        {
          label: '最后修改时间',
          value: 'lastUpdateTime',
          format(val) {
            return moment(val).format('YYYY-MM-DD hh:mm:ss')
          }
        },
        {
          label: '模块名称',
          value: 'moduleName'
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
          }
        },
        {
          label: '施工方法',
          value: 'constrMethod'
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
          }
        },
        {
          label: '循环时间',
          value: 'cycleTime',
          format(val) {
            return val + 'min'
          }
        },
        {
          label: '循环进尺',
          value: 'cycleForward',
          format(val) {
            return val + 'm'
          }
        },
        {
          label: '模块来源',
          value: 'from'
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'moduleName'
      },
      ldata: [
        {
          label: 'Level one 1',
          children: [
            {
              label: 'Level two 1-1',
              children: [
                {
                  label: 'Level three 1-1-1'
                }
              ]
            }
          ]
        },
        {
          label: 'Level one 2',
          children: [
            {
              label: 'Level two 2-1',
              children: [
                {
                  label: 'Level three 2-1-1'
                }
              ]
            },
            {
              label: 'Level two 2-2',
              children: [
                {
                  label: 'Level three 2-2-1'
                }
              ]
            }
          ]
        },
        {
          label: 'Level one 3',
          children: [
            {
              label: 'Level two 3-1',
              children: [
                {
                  label: 'Level three 3-1-1'
                }
              ]
            },
            {
              label: 'Level two 3-2',
              children: [
                {
                  label: 'Level three 3-2-1'
                }
              ]
            }
          ]
        }
      ]
    }
  },
  methods: {
    check(node) {
      console.log(node)
    }
  },
  computed: {
    parData() {
      return { ...this.data }
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
      width: 100%;
      & > span {
        flex: 1;
      }
    }
  }
}
</style>
