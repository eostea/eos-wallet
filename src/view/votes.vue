<template>
  <div class="container">
    <el-row>
      <el-col :xs="24" :sm="22" :lg="14" :push="1">
        <el-card>
          <h3>选择投票节点</h3>
          <el-transfer
            style="text-align: left; display: inline-block"
            v-model="form.producers"
            filterable
            :left-default-checked="[2, 3]"
            :right-default-checked="[1]"
            :titles="['节点列表', '已选节点']"
            :format="{
              noChecked: '${total}',
              hasChecked: '${checked}/${total}'
            }"
            :data="tableData">
          </el-transfer>
        </el-card>
        <el-card>
          <h3>投票给生产者</h3>
          <el-form :model="form" :rules="rules" ref="form">
            <el-form-item label="投票者" prop="voter">
              <el-select v-model="form.voter" placeholder="请选择账户">
                <el-option
                  v-for="name in accountNames"
                  :key="name"
                  :label="name"
                  :value="name">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="代理人">
              <el-input v-model="form.proxy" placeholder="委托给代理人"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSubmit('form')">确定</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      <el-col :lg="6" :push="2" class="hidden-md-and-down">
        <el-card style="color: #909399;">
          <h3 style="color: #2c3e50;">提示：</h3>
          <p>设置代理人和投票节点不能同时进行</p>
          <p>代理账号必须先注册成代理人</p>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import {errorHelper} from '@/utils/helper'

export default {
  name: 'votes',
  data () {
    return {
      form: {
        voter: '',
        proxy: '',
        producers: []
      },
      rules: {
        voter: {required: true, message: '请选择投票账户', trigger: 'blur'}
      },
      tableData: [],
      eosmonitorTransaction: 'https://party.eosmonitor.io/txn'
    }
  },
  mounted () {
    this.getProducersFormTableRows()
  },
  methods: {
    handleSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (this.form.proxy !== '' && this.form.producers.length > 0) {
          this.$message.warning('代理和投票不能同时进行')
          return false
        }
        if (valid) {
          this.openFullScreenLoading()
          this.voteproducer()
        } else {
          this.$message.warning('填写有误')
          console.log('error submit!!')
          return false
        }
      })
    },
    voteproducer () {
      let config = Object.assign(
        {
          keyProvider: this.privateKey
        },
        this.eosConfig
      )
      let eos = this.$eosjs(config)
      eos.voteproducer(this.form)
        .then(res => {
          /* eslint-disable camelcase */
          let { transaction_id } = res
          this.loading.close()
          this.$notify({
            title: '投票成功',
            message: `
            <p>接下来可以</p>
            <a href="${this.eosmonitorTransaction}/${transaction_id}" target="_blank">前往查看浏览器操作详情<a>
            `,
            duration: 0,
            type: 'success',
            dangerouslyUseHTMLString: true
          })
        })
        .catch(e => {
          this.loading.close()
          this.$message.error(errorHelper(e))
        })
    },
    getProducersFormTableRows () {
      this.openFullScreenLoading()
      let params = {
        json: true,
        code: 'eosio',
        scope: 'eosio',
        table: 'producers',
        limit: -1
      }
      this.network.getTableRows(params)
        .then(res => {
          this.tableData = Object.assign([], res.rows).map(item => {
            return {
              key: item.owner,
              label: item.owner,
              disabled: false
            }
          })
          this.loading.close()
        })
        .catch(e => {
          console.log(e)
          this.loading.close()
          this.$message.error('获取数据失败')
        })
    },
    openFullScreenLoading () {
      this.loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
    }
  },
  computed: {
    ...mapState({
      privateKey: state => state.key.priKeys,
      accountNames: state => state.accountNames,
      network: state => state.eos,
      eosConfig: state => state.eosConfig
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-card + .el-card {
  margin-top: 20px;
}
</style>
