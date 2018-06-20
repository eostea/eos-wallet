<template>
  <el-row class="container">
    <el-col :xs="24" :sm="22" :lg="14">
      <el-card>
        <h3>竞价账户</h3>
        <el-form :model="form" :rules="rules" ref="form">
          <el-form-item label="投标人" prop="bidder">
            <el-select v-model="form.bidder" filterable placeholder="请选择账户">
              <el-option
                v-for="name in accountNames"
                :key="name"
                :label="name"
                :value="name">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="新账户名" prop="newname">
            <el-input
              maxlength="12"
              v-model="form.newname"
              placeholder="字符范围 1-5 a-z"></el-input>
          </el-form-item>
          <el-form-item label="出价数量 例:2.0000 EOS" prop="bid">
            <el-input v-model="form.bid" placeholder="购买数量，单位为：EOS"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSubmit('form')">确定出价</el-button>
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
  name: 'bidname',
  data () {
    let validateAccountName = function (rule, val, cb) {
      let re = /^[1-5a-z.]+$/g
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
        bidder: '',
        newname: '',
        bid: '0.0001 EOS' // EOS quantity
      },
      rules: {
        bidder: {required: true, message: '请输入合约账户名', trigger: 'change'},
        newname: {required: true, validator: validateAccountName, trigger: 'blur'},
        bid: {required: true, message: '请输入', trigger: 'blur'}
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
          this.bidname()
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
    bidname () {
      this.network().bidname(this.form)
        .then(res => {
          /* eslint-disable camelcase */
          let { transaction_id } = res
          this.loading.close()
          this.$notify({
            title: '购买成功',
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
            title: '购买失败',
            message: `
            <p>可能的原因</p>
            <ol>
              <li>收款账户不存在</li>
              <li>账户余额不足</li>
            </ol>
            <br>
            前往查看账户余额： <a href="${this.eosmonitorAccount}/${this.form.bidder}" target="_blank">${this.form.bidder}<a>
            <br>
            前往查看账户是否存在：<a href="${this.eosmonitorAccounts}" target="_blank">${this.form.newname}<a>
            <br>
            `,
            duration: 4000,
            type: 'error',
            dangerouslyUseHTMLString: true
          })
        })
    },
    buyrambytes () {
      this.network().buyrambytes(this.bytesForm)
        .then(res => {
          let { transaction_id } = res
          this.loading.close()
          this.$notify({
            title: '购买成功',
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
            title: '购买失败',
            message: `
            <p>可能的原因</p>
            <ol>
              <li>接收账户不存在</li>
              <li>账户余额不足</li>
            </ol>
            <br>
            前往查看账户余额： <a href="${this.eosmonitorAccount}/${this.form.bidder}" target="_blank">${this.form.bidder}<a>
            <br>
            前往查看账户是否存在：<a href="${this.eosmonitorAccounts}" target="_blank">${this.form.newname}<a>
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
