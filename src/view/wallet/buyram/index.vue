<template>
  <el-card>
    <h3>购买ram，单位(EOS)</h3>
    <el-form :model="EOSForm" :rules="EOSRules" ref="EOSForm">
      <el-form-item label="付款账户" prop="payer">
        <el-select v-model="EOSForm.payer" placeholder="请选择账户">
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
          v-model="EOSForm.receiver"
          placeholder="字符范围 1-5 a-z"></el-input>
      </el-form-item>
      <el-form-item label="购买数量 例:2 EOS" prop="quant">
        <el-input v-model="EOSForm.quant" placeholder="购买数量，单位为：EOS"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSubmit('EOSForm')">确定购买</el-button>
      </el-form-item>
    </el-form>
    <hr>
    <h3>购买ram，单位为字节(Bytes)</h3>
    <el-form :model="bytesForm" :rules="bytesRules" ref="bytesForm">
      <el-form-item label="付款账户" prop="payer">
        <el-select v-model="bytesForm.payer" placeholder="请选择账户">
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
          v-model="bytesForm.receiver"
          placeholder="字符范围 1-5 a-z"></el-input>
      </el-form-item>
      <el-form-item label="购买大小 例:1024" prop="bytes">
        <el-input v-model.number="bytesForm.bytes" type="number" placeholder="购买ram，单位为：bytes且必须为整数"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSubmit('bytesForm')">确定购买</el-button>
      </el-form-item>
    </el-form>
  </el-card>
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
      EOSForm: {
        payer: '',
        receiver: '',
        quant: '10 EOS' // EOS quantity
      },
      EOSRules: {
        payer: {required: true, message: '请输入合约账户名', trigger: 'change'},
        receiver: {required: true, validator: validateAccountName, trigger: 'blur'},
        quant: {required: true, message: '请输入', trigger: 'blur'}
      },
      bytesForm: {
        payer: '',
        receiver: '',
        bytes: 1024
      },
      bytesRules: {
        payer: {required: true, message: '请输入合约账户名', trigger: 'change'},
        receiver: {required: true, validator: validateAccountName, trigger: 'blur'},
        bytes: {required: true, message: '请输入', trigger: 'blur'}
      },
      // eosmonitor url
      eosmonitorTransaction: 'https://party.eosmonitor.io/txn',
      eosmonitorAccounts: 'https://party.eosmonitor.io/accounts',
      eosmonitorAccount: 'https://party.eosmonitor.io/account'
    }
  },
  methods: {
    handleSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.openFullScreenLoading()
          formName === 'EOSForm' ? this.buyram() : this.buyrambytes()
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
    buyram () {
      this.network().buyram(this.EOSForm)
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
            前往查看账户余额： <a href="${this.eosmonitorAccount}/${this.EOSForm.payer}" target="_blank">${this.EOSForm.payer}<a>
            <br>
            前往查看账户是否存在：<a href="${this.eosmonitorAccounts}" target="_blank">${this.EOSForm.receiver}<a>
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
            前往查看账户余额： <a href="${this.eosmonitorAccount}/${this.EOSForm.payer}" target="_blank">${this.EOSForm.payer}<a>
            <br>
            前往查看账户是否存在：<a href="${this.eosmonitorAccounts}" target="_blank">${this.EOSForm.receiver}<a>
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

</style>
