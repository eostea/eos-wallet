<template>

  <el-row class="container">
    <el-col :xs="24" :sm="22" :lg="14">
      <el-card>
        <h3>抵押EOS</h3>
        <el-form :model="form" :rules="rules" ref="form">
          <el-form-item label="账户" prop="from">
            <el-select v-model="form.from" filterable placeholder="请选择账户">
              <el-option
                v-for="name in accountNames"
                :key="name"
                :label="name"
                :value="name">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="接收账户" prop="receiver">
            <el-input
              maxlength="12"
              v-model="form.receiver"
              placeholder="字符范围 1-5 a-z"></el-input>
          </el-form-item>
          <el-form-item label="抵押net数量 -- 例: 10.0000 EOS" prop="stake_net_quantity">
            <el-input v-model="form.stake_net_quantity" placeholder="EOS网络的NET"></el-input>
          </el-form-item>
          <el-form-item label="抵押cpu数量 -- 例: 10.0000 EOS" prop="stake_cpu_quantity">
            <el-input v-model="form.stake_cpu_quantity" placeholder="EOS网络的CPU"></el-input>
          </el-form-item>
          <el-form-item label="transfer">
            <el-radio v-model="form.transfer" :label="1">true</el-radio>
            <el-radio v-model="form.transfer" :label="0">false</el-radio>
            <span>( 这一项设置为 true 时，抵押会转给账户账号 )</span>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSubmit('form')">确定抵押</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-col>

     <el-col :xs="24" :sm="22" :lg="8" class="aside-spaceing">
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

export default {
  name: 'delegatebw',
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
      form: {
        from: '',
        receiver: '',
        stake_net_quantity: '',
        stake_cpu_quantity: '',
        transfer: 0
      },
      rules: {
        from: {required: true, message: '请选择账户名', trigger: 'change'},
        receiver: {required: true, validator: validateAccountName, trigger: 'blur'},
        stake_net_quantity: {required: true, message: '请输入抵押数量，例:10.0000 EOS', trigger: 'blur'},
        stake_cpu_quantity: {required: true, message: '请输入抵押数量，例:10.0000 EOS', trigger: 'blur'},
        transfer: {required: true, message: '请选择', trigger: 'change'}
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
          this.delegatebw()
        } else {
          this.$message.warning('填写有误')
          console.log('error submit!!')
          return false
        }
      })
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
    delegatebw () {
      this.network()
        .delegatebw(this.form)
        .then(res => {
          /* eslint-disable camelcase */
          let { transaction_id } = res
          this.loading.close()
          this.$notify({
            title: '抵押成功',
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
          // error tips
          this.$message.error(errorHelper(e))
          this.loading.close()
          this.$notify({
            title: '抵押失败',
            message: `
            <p>可能的原因</p>
            <ol>
              <li>接收账户不存在</li>
              <li>账户余额不足</li>
            </ol>
            <br>
            前往查看账户余额： <a href="${this.eosmonitorAccount}/${this.form.from}" target="_blank">${this.form.from}<a>
            <br>
            前往查看账户是否存在：<a href="${this.eosmonitorAccounts}" target="_blank">${this.form.receiver}<a>
            <br>
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
