<template>
  <page-header-wrapper :title="false">
    <a-card>
      <a-form :form="agentSearchForm" layout="vertical">
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="微服务/元应用名称">
              <a-input v-model="agentSearchForm.name" placeholder="请输入微服务/元应用名称" />
            </a-form-item>
            <a-form-item label="通用描述">
              <a-input v-model="agentSearchForm.description" placeholder="请输入通用描述" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form :form="agentSearchForm" layout="vertical">
              <a-form-item label="作用">
                <a-input v-model="agentSearchForm.role" placeholder="请输入作用" />
              </a-form-item>
              <a-form-item label="技术要求">
                <a-input v-model="agentSearchForm.requirement" placeholder="请输入技术要求" />
              </a-form-item>
            </a-form>
          </a-col>
          <a-col :span="8">
            <a-form-item label="功能">
              <a-input v-model="agentSearchForm.function" placeholder="请输入功能" />
            </a-form-item>
            <a-form-item label="检索操作">
              <div style="display: flex; flex-direction: row; justify-content: space-between">
                <a-button icon="sync" @click="handleReset">重置输入</a-button>
                <a-button ref="ragButton" class="rag-input-bubble-button" @click="toggleRAGInput">
                  <a-icon type="dot-chart" v-if="!showRAGInput"/>
                  <a-icon type="close" v-else/>
                  领域增强
                </a-button>
                <a-button type="primary" icon="file-search" @click="handleAgentSearch" :loading="agentSearchLoading">智能检索</a-button>
              </div>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
    <a-card :bordered="false">
      <a-form layout="vertical">
        <a-row :gutter="16">
          <!-- 属性标签筛选（多选框） -->
          <a-col :span="24">
            <a-form-item label="">
              <a-checkbox-group v-model="queryParam.attribute" @change="handleTagChange('attribute', $event)">
                <a-checkbox v-for="(item, index) in attributeArr" :key="index" :value="index">
                  {{ item }}
                </a-checkbox>
              </a-checkbox-group>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <!-- 类型标签筛选（下拉框） -->
          <a-col :span="4">
            <a-form-item label="类型">
              <a-select
                v-model="queryParam.type"
                placeholder="请选择类型"
                @change="handleTagChange('type', $event)"
                allow-clear
              >
                <a-select-option v-for="(item, index) in typeArr" :key="index" :value="index">
                  {{ item }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <!-- 领域标签筛选（下拉框） -->
          <a-col :span="4">
            <a-form-item label="领域">
              <a-select
                v-model="queryParam.domain"
                placeholder="请选择领域"
                @change="handleTagChange('domain', $event)"
                allow-clear
              >
                <a-select-option v-for="(item, index) in domainArr" :key="index" :value="index">
                  {{ item }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <!-- 行业标签筛选（下拉框） -->
          <a-col :span="4">
            <a-form-item label="行业">
              <a-select
                v-model="queryParam.industry"
                placeholder="请选择行业"
                @change="handleTagChange('industry', $event)"
                allow-clear
              >
                <a-select-option v-for="(item, index) in industryArr" :key="index" :value="index">
                  {{ item }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <!-- 场景标签筛选（下拉框） -->
          <a-col :span="4">
            <a-form-item label="场景">
              <a-select
                v-model="queryParam.scenario"
                placeholder="请选择场景"
                @change="handleTagChange('scenario', $event)"
                allow-clear
              >
                <a-select-option v-for="(item, index) in scenarioArr" :key="index" :value="index">
                  {{ item }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <!-- 技术标签筛选（下拉框） -->
          <a-col :span="4">
            <a-form-item label="技术">
              <a-select
                v-model="queryParam.technology"
                placeholder="请选择技术"
                @change="handleTagChange('technology', $event)"
                allow-clear
              >
                <a-select-option v-for="(item, index) in technologyArr" :key="index" :value="index">
                  {{ item }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
    <a-card :bordered="false" :title="agentSearchData.length > 0 ? 'AI智能检索为您推荐以下微服务' : false">
      <a-table
        ref="table"
        :columns="columns"
        :dataSource="filteredDataSource"
      >
        <span slot="serial" slot-scope="text, record, index">
          {{ index + 1 }}
        </span>
        <span slot="status" slot-scope="text">
          <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
        </span>
        <span slot="norm" slot-scope="text">
          <a-popover v-for="(item, index) in text" :key="index" title="可信云技术服务溯源">
            <template slot="content">
              <p>{{ item.key | normFilter }}</p>
              <el-rate v-model="item.score" disabled show-score text-color="#ff9900" />
            </template>
            <a-tag color="#87d068">
              <a-icon type="check" /> {{ item.key | normFilter }}
            </a-tag>
          </a-popover>
        </span>
        <span slot="source" slot-scope="text">
          <a-popover :title="text.popoverTitle">
            <template slot="content">
              <h1>公司信息</h1>
              <p><strong>公司名称：</strong>{{ text.companyName }}</p>
              <p><strong>地址：</strong>{{ text.companyAddress }}</p>
              <p><strong>联系方式：</strong>{{ text.companyContact }}</p>
              <p><strong>简介：</strong>{{ text.companyIntroduce }}</p>
              <p>综合可信度：</p>
              <el-rate v-model="text.companyScore" disabled show-score text-color="#ff9900" :score-template="text.companyScore.toString()"></el-rate>
              <h1>微服务信息</h1>
              <p><strong>微服务描述:</strong> {{ text.msIntroduce }}</p>
              <p>综合可信度：
                <el-rate v-model="text.msScore" disabled show-score text-color="#ff9900" :score-template="text.msScore.toString()"></el-rate>
              </p>
            </template>
            <a-tag color="blue" @change="handleSource(text)">知识产权</a-tag>
          </a-popover>
          <a-popover :title="text.popoverTitle">
            <template slot="content">
              <h1>公司信息</h1>
              <p><strong>公司名称：</strong>{{ text.companyName }}</p>
              <p><strong>地址：</strong>{{ text.companyAddress }}</p>
              <p><strong>联系方式：</strong>{{ text.companyContact }}</p>
              <p><strong>简介：</strong>{{ text.companyIntroduce }}</p>
              <p>综合可信度：</p>
              <el-rate v-model="text.companyScore" disabled show-score text-color="#ff9900" :score-template="text.companyScore.toString()"></el-rate>
              <h1>微服务信息</h1>
              <p><strong>微服务描述:</strong> {{ text.msIntroduce }}</p>
              <p>综合可信度：
                <el-rate v-model="text.msScore" disabled show-score text-color="#ff9900" :score-template="text.msScore.toString()"></el-rate>
              </p>
            </template>
            <a-tag color="cyan" @change="handleSource(text)">应用案例</a-tag>
          </a-popover>
          <a-popover :title="text.popoverTitle">
            <template slot="content">
              <h1>公司信息</h1>
              <p><strong>公司名称：</strong>{{ text.companyName }}</p>
              <p><strong>地址：</strong>{{ text.companyAddress }}</p>
              <p><strong>联系方式：</strong>{{ text.companyContact }}</p>
              <p><strong>简介：</strong>{{ text.companyIntroduce }}</p>
              <p>综合可信度：</p>
              <el-rate v-model="text.companyScore" disabled show-score text-color="#ff9900" :score-template="text.companyScore.toString()"></el-rate>
              <h1>微服务信息</h1>
              <p><strong>微服务描述:</strong> {{ text.msIntroduce }}</p>
              <p>综合可信度：
                <el-rate v-model="text.msScore" disabled show-score text-color="#ff9900" :score-template="text.msScore.toString()"></el-rate>
              </p>
            </template>
            <a-tag color="orange" @change="handleSource(text)">舆情信息</a-tag>
          </a-popover>
          <a-popover :title="text.popoverTitle">
            <template slot="content">
              <h1>公司信息</h1>
              <p><strong>公司名称：</strong>{{ text.companyName }}</p>
              <p><strong>地址：</strong>{{ text.companyAddress }}</p>
              <p><strong>联系方式：</strong>{{ text.companyContact }}</p>
              <p><strong>简介：</strong>{{ text.companyIntroduce }}</p>
              <p>综合可信度：</p>
              <el-rate v-model="text.companyScore" disabled show-score text-color="#ff9900" :score-template="text.companyScore.toString()"></el-rate>
              <h1>微服务信息</h1>
              <p><strong>微服务描述:</strong> {{ text.msIntroduce }}</p>
              <p>综合可信度：
                <el-rate v-model="text.msScore" disabled show-score text-color="#ff9900" :score-template="text.msScore.toString()"></el-rate>
              </p>
            </template>
            <a-tag color="green" @change="handleSource(text)">链上存证</a-tag>
          </a-popover>
        </span>
        <span slot="action" slot-scope="text, record">
          <template>
            <a-button type="link" @click="handleEdit(record)">编辑</a-button>
            <a-button type="link" @click="handleUse(record)">使用</a-button>
          </template>
        </span>
      </a-table>
    </a-card>
    <!-- 编辑模态框 -->
    <a-modal
      title="编辑记录"
      :visible="visible"
      @ok="handleOk"
      @cancel="handleCancel"
      :confirmLoading="confirmLoading"
    >
      <a-form :form="editForm" layout="vertical">
        <a-form-item label="服务名称">
          <a-input
            v-decorator="[
              'name',
              {
                rules: [{ required: true, message: '请输入服务名称' }],
                initialValue: mdl.name,
              },
            ]"
          />
        </a-form-item>
        <a-form-item label="服务类型">
          <a-select
            v-decorator="[
              'type',
              {
                rules: [{ required: true, message: '请选择服务类型' }],
                initialValue: mdl.type,
              },
            ]"
          >
            <a-select-option v-for="(item, index) in typeArr" :key="index" :value="index">
              {{ item }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="技术类型">
          <a-select
            v-decorator="[
              'technology',
              {
                rules: [{ required: true, message: '请选择技术类型' }],
                initialValue: mdl.technology,
              },
            ]"
          >
            <a-select-option v-for="(item, index) in technologyArr" :key="index" :value="index">
              {{ item }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="技术指标">
          <a-row v-for="(item, index) in normMap" :key="index">
            <div v-if="mdl.norm.some(n => n.key === index)" style="display: flex; height: 30px">
              {{ item.text }}
              <el-rate
                v-model="mdl.norm.find(n => n.key === index).score"
                style="margin-left: 10px;"
                show-score
                text-color="#ff9900"
              />
            </div>
          </a-row>
        </a-form-item>
        <a-form-item label="服务溯源">
          <a-form-item label="公司名称">
            <a-input
              v-decorator="[
                'source.companyName',
                {
                  rules: [{ required: true, message: '请输入公司名称' }],
                  initialValue: mdl.source.companyName,
                },
              ]"
            />
          </a-form-item>
          <a-form-item label="公司地址">
            <a-input
              v-decorator="[
                'source.companyAddress',
                {
                  rules: [{ required: true, message: '请输入公司地址' }],
                  initialValue: mdl.source.companyAddress,
                },
              ]"
            />
          </a-form-item>
          <a-form-item label="联系方式">
            <a-input
              v-decorator="[
                'source.companyContact',
                {
                  rules: [{ required: true, message: '请输入联系方式' }],
                  initialValue: mdl.source.companyContact,
                },
              ]"
            />
          </a-form-item>
          <a-form-item label="微服务描述">
            <a-textarea
              v-decorator="[
                'source.msIntroduce',
                {
                  rules: [{ required: true, message: '请输入微服务描述' }],
                  initialValue: mdl.source.msIntroduce,
                },
              ]"
            />
          </a-form-item>
          <a-form-item label="公司评分">
            <el-rate
              v-decorator="[
                'source.companyScore',
                {
                  rules: [{ required: true, message: '请输入公司评分' }],
                  initialValue: mdl.source.companyScore,
                },
              ]"
              show-score
              text-color="#ff9900"
            />
          </a-form-item>
          <a-form-item label="微服务评分">
            <el-rate
              v-decorator="[
                'source.msScore',
                {
                  rules: [{ required: true, message: '请输入微服务评分' }],
                  initialValue: mdl.source.msScore,
                },
              ]"
              show-score
              text-color="#ff9900"
            />
          </a-form-item>
        </a-form-item>
      </a-form>
    </a-modal>
    <!-- 知识增强容器 -->
    <div
      v-if="showRAGInput"
      ref="ragContainer"
      class="rag-input-container"
      :style="containerStyle"
    >
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="上传知识库文档">
            <a-upload
              :file-list="ragFiles"
              :remove="removeRagFile"
              :customRequest="customRagFileChose"
              :multiple="true">
              <a-button> <a-icon type="upload" /> 选择文件 </a-button>
            </a-upload>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item tooltip="value*category">
            <span slot="label">上载知识库
              <a-tooltip title="上载后可以使用该知识库进行领域知识增强检索">
                <a-icon type="question-circle-o" />
              </a-tooltip>
            </span>
            <a-button type="primary" @click="handleRagUpload" icon="cloud-upload" :loading="ragUploadLoading">
              提交
            </a-button>
          </a-form-item>
        </a-col>
      </a-row>
    </div>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { ArticleListContent, Ellipsis, StandardFormRow, TagSelect } from '@/components'
import { getAmlMetaApps, getAmlServices } from '@/mock/data/services_data'
import {
  getAttributeMap,
  getIndustryMap,
  getNormMap,
  getScenarioMap,
  getServiceStatusMap,
  getServiceTypeMap,
  getTechnologyMap
} from '@/mock/data/map_data'
import request from '@/utils/request'

const TagSelectOption = TagSelect.Option

export default {
  name: 'TableList',
  components: {
    Ellipsis,
    TagSelect,
    StandardFormRow,
    ArticleListContent,
    TagSelectOption
  },
  data () {
    return {
      editForm: this.$form.createForm(this),
      visible: false,
      confirmLoading: false,
      mdl: {
        name: '',
        norm: [],
        source: {}
      },
      // 知识增强
      showRAGInput: false,
      ragFiles: [],
      ragUploadFiles: [],
      ragUploadUrl: 'https://apirag.xyz:8086/api/predict',
      ragUploadMethod: 'POST',
      ragUploadLoading: false,
      hasRagData: false,
      agentSearchLoading: false,
      agentSearchForm: {
        name: '',
        description: '',
        role: '',
        function: '',
        requirement: ''
      },
      agentSearchApiUrl: 'https://apirag.xyz:8086/api/predict',
      agentSearchApiMethod: 'POST',
      agentSearchApiHeader: { 'Content-Type': 'application/json;charset=UTF-8' },
      agentSearchApiResult: { answer: '' },
      agentSearchData: [],
      statusMap: getServiceStatusMap(),
      normMap: getNormMap(),
      // 查询参数
      queryParam: {
        attribute: [],
        type: [],
        domain: [],
        industry: [],
        scenario: [],
        technology: []
      },
      // 加载数据方法 必须为 Promise 对象
      columns: [
        {
          title: '#',
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: '服务名称',
          dataIndex: 'name'
        },
        {
          title: '服务类型',
          dataIndex: 'type',
          width: '100px',
          customRender: (text) => this.typeArr[text]
        },
        {
          title: '技术类型',
          dataIndex: 'technology',
          width: '100px',
          customRender: (text) => this.technologyArr[text]
        },
        {
          title: '服务状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '技术指标',
          dataIndex: 'norm',
          scopedSlots: { customRender: 'norm' }
        },
        {
          title: '调用次数',
          dataIndex: 'number',
          customRender: (text) => text + ' 次'
        },
        {
          title: '服务溯源',
          dataIndex: 'source',
          scopedSlots: { customRender: 'source' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '80px',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      dataSource: [],
      filteredDataSource: [],
      selectedRowKeys: [],
      selectedRows: [],
      attributeArr: getAttributeMap(),
      typeArr: getServiceTypeMap(),
      domainArr: ['跨境支付AI监测服务'],
      industryArr: getIndustryMap('aml'),
      scenarioArr: getScenarioMap('aml'),
      technologyArr: getTechnologyMap('aml'),
      containerStyle: {
        top: '0',
        left: '0'
      }
    }
  },
  filters: {
    statusFilter (type) {
      const statusMap = getServiceStatusMap()
      return statusMap[type].text
    },
    statusTypeFilter (type) {
      const statusMap = getServiceStatusMap()
      return statusMap[type].status
    },
    normFilter (type) {
      const normMap = getNormMap()
      return normMap[type].text
    }
  },
  created () {
    this.initData()
  },
  mounted() {
    // 监听窗口大小变化，动态调整容器位置
    window.addEventListener('resize', this.updateContainerPosition)
  },
  beforeDestroy() {
    // 移除事件监听
    window.removeEventListener('resize', this.updateContainerPosition)
  },
  methods: {
    handleTagChange(field, value) {
      if (Array.isArray(value)) {
        // 对于下拉框a-select来说，mode="multiple"时选择结果就是数组
        this.queryParam[field] = value
      } else {
        this.queryParam[field] = [value]
      }
      this.filterDataSource()
    },
    filterDataSource() {
      this.filteredDataSource = this.dataSource.filter(item => {
        return (
          (this.queryParam.attribute.length > 0
            ? this.queryParam.attribute.includes(item.attribute)
            : true) &&
          (this.queryParam.type.length > 0
            ? this.queryParam.type.includes(item.type)
            : true) &&
          (this.queryParam.industry.length > 0
            ? this.queryParam.industry.includes(item.industry)
            : true) &&
          (this.queryParam.scenario.length > 0
            ? this.queryParam.scenario.includes(item.scenario)
            : true) &&
          (this.queryParam.technology.length > 0
            ? this.queryParam.technology.includes(item.technology)
            : true)
        )
      })
    },
    handleSearch() {
      this.filterDataSource()
    },
    handleReset() {
      this.agentSearchForm = {
        name: '',
        description: '',
        role: '',
        function: '',
        requirement: ''
      }
    },
    handleEdit(record) {
      this.visible = true // 显示模态框
      this.mdl = { ...record } // 将选中的记录数据复制到 mdl 中
      this.$nextTick(() => {
        // 填充表单数据
        this.editForm.setFieldsValue({
          name: record.name,
          type: record.type,
          technology: record.technology,
          norm: record.norm.map(item => item.key),
          'source.companyName': record.source.companyName,
          'source.companyAddress': record.source.companyAddress,
          'source.companyContact': record.source.companyContact,
          'source.msIntroduce': record.source.msIntroduce,
          'source.companyScore': record.source.companyScore,
          'source.msScore': record.source.msScore
        })
      })
    },
    handleOk() {
      this.editForm.validateFields((errors, values) => {
        if (!errors) {
          this.confirmLoading = true
          const norm = values.norm.map(key => {
            const existingNorm = this.mdl.norm.find(n => n.key === key)
            return {
              key,
              score: existingNorm ? existingNorm.score : 5
            }
          })

          // 更新 source 数据
          const source = {
            popoverTitle: '可信云技术服务溯源',
            companyName: values['source.companyName'],
            companyAddress: values['source.companyAddress'],
            companyContact: values['source.companyContact'],
            msIntroduce: values['source.msIntroduce'],
            companyScore: values['source.companyScore'],
            msScore: values['source.msScore']
          }

          // 更新 mdl 数据
          this.mdl = {
            ...this.mdl,
            ...values,
            norm,
            source
          }

          // 模拟异步操作
          setTimeout(() => {
            // 更新数据
            const index = this.dataSource.findIndex(item => item.id === this.mdl.id)
            if (index > -1) {
              this.dataSource.splice(index, 1, this.mdl)
            }
            this.visible = false
            this.confirmLoading = false
            this.$message.success('编辑成功')
          }, 1000)
        }
      })
    },
    handleCancel() {
      this.visible = false
      this.editForm.resetFields()
      this.mdl = {
        name: '',
        norm: [],
        source: {}
      }
    },
    handleSource(record) {
      // console.log(record)
    },
    handleUse(record) {
      switch (record.status) {
        case 0:
          this.$message.error('服务部署失败，请重新部署后使用！')
          break
        case 2:
          this.$message.info('服务未运行，请启动后使用！')
          break
        case 3:
          this.$message.error('服务异常，暂无法使用！')
          break
        case 5:
          this.$message.warning('服务部署中，暂无法使用！')
          break
        default:
          this.$emit('onGoUse', record)
          break
      }
    },
    delConfirm() {
      this.$message.success('删除成功！')
    },
    handleSub(record) {
      if (record.status !== 0) {
        this.$message.info(`${record.no} 订阅成功`)
      } else {
        this.$message.error(`${record.no} 订阅失败，规则已关闭`)
      }
    },
    handleChange(value) {
      // console.log(`selected ${value}`)
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    resetSearchForm() {
      this.queryParam = {
        date: moment(new Date())
      }
    },
    async handleAgentSearch() {
      const { name, description, role, function: feature, requirement } = this.agentSearchForm
      if (name || description || role || feature || requirement) {
        this.agentSearchLoading = true
        // 知识增强
        if (this.hasRagData) {
          this.$message.info('正在应用领域知识增强进行智能检索...')
          console.log(this.ragFiles)
        } else {
          this.$message.info('正在进行智能检索...')
          console.log(this.agentSearchForm)
        }
        try {
          // 处理响应
          this.agentSearchApiResult = await request({
            url: this.agentSearchApiUrl,
            method: this.agentSearchApiMethod,
            data: this.agentSearchForm,
            headers: this.agentSearchApiHeader
          })
          this.agentSearchData = this.agentSearchApiResult.answer.split('\n')
          this.filteredDataSource = this.dataSource.filter(item => this.agentSearchData.includes(item.name))
          this.$nextTick(() => {
            this.$message.success('检索完毕！')
            // 滚动到表格处
            const table = this.$refs.table.$el
            table.scrollIntoView()
          })
        } catch (error) {
          console.log(error)
          this.$message.error('请求异常，请稍后重试！')
        } finally {
          this.agentSearchLoading = false
        }
      } else {
        this.$message.error('请先输入您的需求！')
      }
    },
    initData () {
      this.agentSearchData = []
      this.dataSource = [...getAmlServices(), ...getAmlMetaApps()]
      this.filteredDataSource = this.dataSource
    },
    toggleRAGInput() {
      this.showRAGInput = !this.showRAGInput
      if (this.showRAGInput) {
        this.$nextTick(() => {
          this.updateContainerPosition()
        })
      }
    },
    updateContainerPosition() {
      const button = this.$refs.ragButton.$el
      const container = this.$refs.ragContainer

      if (button && container) {
        const buttonRect = button.getBoundingClientRect()
        // 设置容器的位置在按钮的下侧
        this.containerStyle = {
          top: `${buttonRect.top + 50}px`,
          left: `${buttonRect.left - 120}px`
        }
      }
    },
    // 知识增强文件
    async customRagFileChose (options) {
      const { file } = options
      if (!file) {
        return false
      }
      const url = URL.createObjectURL(file)
      this.ragFiles = [{
        uid: file?.uid,
        name: file.name,
        status: 'done',
        url // url 是展示在页面上的绝对链接
      }]
    },
    removeRagFile () {
      this.ragFiles = []
      this.ragUploadFiles = []
    },
    handleRagUpload() {
      this.ragUploadLoading = true
      console.log(this.agentSearchForm)
      console.log(this.ragFiles)
      // 模拟上传文件
      setTimeout(() => {
        this.ragUploadLoading = false
        this.hasRagData = true
        this.ragFiles = []
        this.ragUploadFiles = []
        this.toggleRAGInput()
        this.$message.success('知识库上传成功！')
      }, 1000)
    }
  }
}
</script>
<style lang="less" scoped>
.list-articles-trigger {
  margin-left: 12px;
}

.rag-input-container {
  position: fixed;
  z-index: 1000;
  width: 400px;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  background: #ffffff;
  overflow: hidden;
  border: 1px solid #e8e8e8;
}

/* 按钮的样式 */
.rag-input-bubble-button {
  border: double;
  padding: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.rag-input-bubble-button:hover {
  background: #40a9f0;
  color: #ffffff;
  transform: scale(1.1); /* 悬停时放大 */
}

.rag-input-bubble-button:active {
  transform: scale(0.95); /* 点击时缩小 */
}
</style>
