<template>
  <div>
    <!--    <div class="ef-node-form">-->
    <el-tabs type="border-card">
      <!--        <div class="ef-node-form-header">-->
      <!--          编辑-->
      <!--        </div>-->
      <el-tab-pane>
        <span slot="label" style="width: 50%">编辑节点</span>
        <!--        <span slot="label">-->
        <!--          <div class="ef-node-form-header">编辑</div>-->
        <!--        </span>-->
        <div class="ef-node-form-body">
          <el-form :model="node" ref="dataForm" label-width="80px" v-show="type === 'node'">
            <el-form-item label="类型">
              <el-input v-model="node.type" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="名称">
              <el-input v-model="node.name" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="left坐标">
              <el-input v-model="node.left"></el-input>
            </el-form-item>
            <el-form-item label="top坐标">
              <el-input v-model="node.top"></el-input>
            </el-form-item>
            <el-form-item label="ico图标">
              <el-input v-model="node.ico"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button icon="el-icon-close">重置</el-button>
              <el-button type="primary" icon="el-icon-check" @click="save">保存</el-button>
            </el-form-item>
          </el-form>

          <el-form :model="line" ref="dataForm" label-width="80px" v-show="type === 'line'">
            <el-form-item label="条件">
              <el-input v-model="line.label"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button icon="el-icon-close">重置</el-button>
              <el-button type="primary" icon="el-icon-check" @click="saveLine">保存</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
      <!--            <div class="el-node-form-tag"></div>-->
      <el-tab-pane label="提交服务">
        <el-form :model="services" ref="dataForm" label-width="80px">
          <el-form-item label="api">
            <el-input v-model="services.api"></el-input>
          </el-form-item>
          <el-form-item label="端口分配">
            <el-input v-model="services.name"></el-input>
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="services.description" :rows="3" type="textarea" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-close">重置</el-button>
            <el-button type="primary" icon="el-icon-check" @click="addScheduledService">保存</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <!--    </div>-->

  </div>

</template>

<script>
import { cloneDeep } from 'lodash'
// eslint-disable-next-line no-unused-vars
import { addFlowService } from '@/api/schedule'

export default {
  data () {
    return {
      visible: true,
      // node 或 line
      type: 'node',
      node: {},
      line: {},
      data: {},
      // 自定义的服务配置，包括服务api，因此先发ajax请求确认
      services: {}
      // 父组件传过来的流程数据
      // flowData: {}
    }
  },
  props: ['flowData', 'dataReloadClear'],
  methods: {
    /**
     * 表单修改，这里可以根据传入的ID进行业务信息获取
     * @param data
     * @param id
     */
    nodeInit (data, id) {
      this.type = 'node'
      this.data = data
      data.nodeList.filter((node) => {
        if (node.id === id) {
          this.node = cloneDeep(node)
        }
      })
    },
    lineInit (line) {
      this.type = 'line'
      this.line = line
    },
    // 修改连线
    saveLine () {
      this.$emit('setLineLabel', this.line.from, this.line.to, this.line.label)
    },
    save () {
      this.data.nodeList.filter((node) => {
        if (node.id === this.node.id) {
          node.name = this.node.name
          node.left = this.node.left
          node.top = this.node.top
          node.ico = this.node.ico
          this.$emit('repaintEverything')
        }
      })
    },
    // 向服务器提交编排的service信息
    addScheduledService () {
      const k = this.services
      k.nodeList = this.flowData.nodeList
      k.lineList = this.flowData.lineList
      setTimeout(() => {
        this.$message.info('镜像正在打包上传，请稍等...')
      }, 1000)
      // 还未联调
      // addFlowService(k).then(result => {
      //   console.dir(result)
      //   this.$message.info('服务添加成功，请前往组合服务页查看')
      //   this.dataReloadClear()
      // }, () => {
      //   this.$message.warning('服务添加失败，请另起服务名称！')
      // })
    }
  }
}
</script>

<style>
.el-node-form-tag {
  position: absolute;
  top: 50%;
  margin-left: -15px;
  height: 40px;
  width: 15px;
  background-color: #fbfbfb;
  border: 1px solid rgb(220, 227, 232);
  border-right: none;
  z-index: 0;
}
</style>
