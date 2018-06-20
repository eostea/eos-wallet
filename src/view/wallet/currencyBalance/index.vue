<template>
  <el-card style="color: #909399;">
    <h3 style="color: #2c3e50;">账户余额</h3>
    <el-form :model="form" :rules="rules" ref="form">
      <el-form-item label="合约账户名" prop="code">
        <el-input v-model="form.code"></el-input>
      </el-form-item>
      <el-form-item label="查询账户" prop="account">
        <el-input maxlength="12" v-model="form.account"></el-input>
      </el-form-item>
      <el-form-item label="代币符号" prop="symbol">
        <el-input v-model="form.symbol"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSubmit('form')">查询</el-button>
      </el-form-item>
    </el-form>
    <hr>
    <ul v-if="currencyBalanceNum.length > 0">
      <li v-for="(item, index) in currencyBalanceNum" :key="index">
        <p>{{ item }}</p>
      </li>
    </ul>
    <p v-else>无</p>
  </el-card>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'currency-balance',
  data () {
    let validateAccountName = function (rule, val, cb) {
      let re = /^[1-5a-z]+$/g
      if (val === '') {
        cb(new Error('请输入账户名'))
      } else if (!re.test(val)) {
        cb(new Error('名字只能包含 1-5 a-z ！'))
      } else {
        cb()
      }
    }
    return {
      loading: null,
      // currency balance
      currencyBalanceNum: [],
      form: {
        code: 'eosio.token',
        account: '',
        symbol: 'EOS'
      },
      rules: {
        code: {required: true, message: '请输入合约账户名', trigger: 'blur'},
        account: {required: true, validator: validateAccountName, trigger: 'blur'},
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
          this.getCurrencyBalance()
        } else {
          this.$message.warning('填写有误')
          console.log('error submit!!')
          return false
        }
      })
    },
    getCurrencyBalance () {
      this.connectEOSNet()
        .then(eos => {
          eos.getCurrencyBalance(this.form)
            .then(cData => {
              this.currencyBalanceNum = cData
              this.$message.success('查询成功')
              this.loading.close()
            })
            .catch(e => {
              this.loading.close()
              console.log(e)
              this.$message.error('查询失败')
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

</style>
