<template>
  <div class="container">
    <el-card>
      <h3>注册为投票代理人</h3>
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="注册账户" prop="proxy">
          <el-select v-model="form.proxy" filterable placeholder="请选择账户">
            <el-option
              v-for="name in accountNames"
              :key="name"
              :label="name"
              :value="name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否成为为代理">
          <el-radio v-model="form.isproxy" :label="1">true</el-radio>
          <el-radio v-model="form.isproxy" :label="0">false</el-radio>
          <p>( 提示：注册代理选 True，取消选 false )</p>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSubmit('form')">确定</el-button>
        </el-form-item>
      </el-form>
    </el-card>
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
        proxy: '',
        isproxy: 1
      },
      rules: {
        proxy: {required: true, message: '请选择注册账户名', trigger: 'change'}
      },
      tableData: [],
      eosmonitorTransaction: 'https://eosmonitor.io/txn',
      loading: null
    }
  },
  methods: {
    handleSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.openFullScreenLoading()
          this.regproxy()
        } else {
          this.$message.warning('填写有误')
          console.log('error submit!!')
          return false
        }
      })
    },
    regproxy () {
      let config = Object.assign(
        {
          keyProvider: this.privateKey
        },
        this.eosConfig
      )
      let eos = this.$eosjs(config)
      eos.regproxy(this.form)
        .then(res => {
          /* eslint-disable camelcase */
          let { transaction_id } = res
          this.loading.close()
          this.$notify({
            title: `${this.isproxy ? '注册' : '取消'}成功`,
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
.container {
  margin-top: 20px;
}
</style>
