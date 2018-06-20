<template>
  <el-card style="color: #909399;">
    <h3 style="color: #2c3e50;">代币发行合约</h3>
    <el-form :model="contractForm" :rules="contractRules" ref="contractForm">
      <el-form-item label="合约账户名" prop="code">
        <el-input v-model="contractForm.code"></el-input>
      </el-form-item>
      <el-form-item label="代币符号" prop="symbol">
        <el-input v-model="contractForm.symbol"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSubmit('contractForm')">查询</el-button>
      </el-form-item>
    </el-form>
    <el-collapse accordion>
      <template v-for="(value, key) in contractData">
        <el-collapse-item :title="key" :name="key" :key="key">
          <p>合约账号: {{ value.issuer }}</p>
          <p>max supply: {{ value.max_supply }}</p>
          <p>supply: {{ value.supply }}</p>
        </el-collapse-item>
      </template>
    </el-collapse>
  </el-card>
</template>

<script>
import { mapActions } from 'vuex'
import {errorHelper} from '@/utils/helper'

export default {
  name: 'currency-balance',
  data () {
    return {
      loading: null,
      contractData: '',
      contractForm: {
        code: 'eosio.token',
        symbol: ''
      },
      contractRules: {
        code: {required: true, message: '请输入合约账户名', trigger: 'blur'},
        symbol: {required: true, message: '请输入代币符号', trigger: 'blur'}
      }
    }
  },
  methods: {
    ...mapActions([
      'connectEOSNet'
    ]),
    handleSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.openFullScreenLoading()
          this.getCurrencyStats()
        } else {
          this.$message.warning('填写有误')
          console.log('error submit!!')
          return false
        }
      })
    },
    getCurrencyStats () {
      this.connectEOSNet()
        .then(eos => {
          eos.getCurrencyStats(this.contractForm)
            .then(cData => {
              this.loading.close()
              this.contractData  = Object.assign({}, cData)
            })
            .catch(e => {
              this.loading.close()
              this.$message.error(errorHelper(e))
            })
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
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-card + .el-card {
  margin-top: 20px;
}
@media (min-width: 1200px) {
  .aside-spaceing {
    margin-left: 20px;
  }
}
</style>
