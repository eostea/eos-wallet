<template>

  <el-row class="container">
    <el-col :xs="24" :sm="22" :lg="14">
      <el-card>
        <h3>出售ram，单位为字节(Bytes)</h3>
        <el-form :model="bytesForm" :rules="bytesRules" ref="bytesForm">
          <el-form-item label="选择账户" prop="account">
            <el-select v-model="bytesForm.account" filterable placeholder="请选择账户">
              <el-option
                v-for="name in accountNames"
                :key="name"
                :label="name"
                :value="name">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="出售大小 例:1024" prop="bytes">
            <el-input v-model.number="bytesForm.bytes" type="number" placeholder="出售ram，单位为：bytes且必须为整数"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSubmit('bytesForm')">确定出售</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-col>

    <el-col :xs="24" :sm="22" :lg="8" class="aside-spaceing">
      <el-card style="color: #909399;">
        <h3 style="color: #2c3e50;">提示：</h3>
        <ol>
          <li>账号格式 1-5 a-z</li>
          <li>单位为 bytes</li>
          <li>bytes必须大于 0</li>
        </ol>
      </el-card>
    </el-col>
  </el-row>

</template>

<script>
import { mapState } from 'vuex'
import {errorHelper} from '@/utils/helper'

export default {
  name: 'buyram',
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
      bytesForm: {
        account: '',
        bytes: 1024
      },
      bytesRules: {
        account: {required: true, validator: validateAccountName, trigger: 'blur'},
        bytes: {required: true, message: '请输入', trigger: 'blur'}
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
          this.sellram()
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
    sellram () {
      this.network().sellram(this.bytesForm)
        .then(res => {
          /* eslint-disable camelcase */
          let { transaction_id } = res
          this.loading.close()
          this.$notify({
            title: '发送交易',
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
            title: '出售失败',
            message: `
            <p>可能的原因</p>
            <ol>
              <li>账户ram不足</li>
            </ol>
            <br>
            前往查看账户详情： <a href="${this.eosmonitorAccount}/${this.bytesForm.account}" target="_blank">${this.bytesForm.account}<a>
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
