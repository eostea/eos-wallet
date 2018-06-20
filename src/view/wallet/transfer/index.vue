<template>

  <el-row class="container">
    <el-col :xs="24" :sm="22" :lg="14">
      <el-card>
        <h2>转账</h2>
        <el-form :model="form" :rules="rules" ref="form">
          <el-form-item label="转账账户" prop="from">
            <el-select v-model="form.from" filterable placeholder="请选择账户">
              <el-option
                v-for="name in accountNames"
                :key="name"
                :label="name"
                :value="name">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="接收账户" prop="to">
            <el-input v-model="form.to" maxlength="12" placeholder="请输入接收账户名"></el-input>
          </el-form-item>
          <el-form-item label="转账数量 例:2.0000 EOS" prop="quantity">
            <el-input v-model="form.quantity" placeholder="请输入EOS数量"></el-input>
          </el-form-item>
          <el-form-item label="备注（可选）">
            <el-input v-model="form.memo" placeholder="备注"></el-input>
          </el-form-item>
          <el-form-item label="广播（可选）">
            <el-radio v-model="options.broadcast" :label="true">true</el-radio>
            <el-radio v-model="options.broadcast" :label="false">false</el-radio>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSubmit('form')">确定转账</el-button>
            <el-button type="ghost" @click="resetForm('form')">重置表单</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-col>

    <el-col :xs="24" :sm="22" :lg="8" class="aside-spaceing">
      <currency-balance></currency-balance>
      <el-card style="color: #909399;">
        <h3 style="color: #2c3e50;">提示：</h3>
        <ol>
          <li>账号格式 1-5 a-z</li>
          <li>代币数量格式 数量+空格+符号</li>
          <li>代币数量需保留四位小数</li>
        </ol>
      </el-card>
    </el-col>

  </el-row>
</template>

<script>
import { mapState } from 'vuex'
import {errorHelper} from '@/utils/helper'
import currencyBalance from '../currencyBalance'

export default {
  name: 'wallet',
  components: {
    currencyBalance
  },
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
      form: {
        from: '',
        to: '',
        quantity: '',
        memo: new Date().toLocaleString('en')
      },
      options: {
        broadcast: true
      },
      rules: {
        from: {required: true, message: '请选择转账账户', trigger: 'change'},
        to: {required: true, validator: validateAccountName, trigger: 'blur'},
        quantity: {required: true, message: '请输入要转的EOS数量', trigger: 'blur'}
      },
      // eosmonitor url
      eosmonitorTransaction: 'https://eosmonitor.io/txn',
      eosmonitorAccounts: 'https://eosmonitor.io/accounts',
      eosmonitorAccount: 'https://eosmonitor.io/account'
    }
  },
  methods: {
    handleSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.openFullScreenLoading()
          this.transferToken()
        } else {
          this.$message.warning('填写有误')
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    network () {
      let config = Object.assign(
        {
          keyProvider: this.privateKey
        },
        this.eosConfig
      )
      return this.$eosjs(config)
    },
    transferToken () {
      this.network().transfer(this.form, this.options.broadcast)
        .then(res => {
          /* eslint-disable camelcase */
          let { transaction_id } = res
          this.loading.close()
          this.$notify({
            title: '转账成功',
            message: `
            <p>接下来可以</p>
            <a href="${this.eosmonitorTransaction}/${transaction_id}" target="_blank">前往查看浏览器操作详情<a>
            `,
            duration: 4000,
            type: 'success',
            dangerouslyUseHTMLString: true
          })
        })
        .catch(e => {
          this.loading.close()
          this.$message.error(errorHelper(e))
          this.$notify({
            title: '转账失败',
            message: `
            <p>可能的原因</p>
            <ol>
              <li>接收账户不存在</li>
              <li>账户余额不足</li>
            </ol>
            <br>
            前往查看账户余额： <a href="${this.eosmonitorAccount}/${this.form.from}" target="_blank">${this.form.from}<a>
            <br>
            前往查看账户是否存在：<a href="${this.eosmonitorAccounts}" target="_blank">${this.form.to}<a>
            `,
            duration: 4000,
            type: 'error',
            dangerouslyUseHTMLString: true
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

@media (min-width: 1200px) {
  .aside-spaceing {
    margin-left: 20px;
  }
}
@media (max-width: 1200px) {
  .aside-spaceing {
    margin-top: 20px;
  }
}
</style>
