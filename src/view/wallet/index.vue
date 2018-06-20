<template>
  <div class="container">
    <el-row>
      <el-col :span="22" :push="1">
        <el-card>
          <el-button type="text" @click="currentTabCompnent = 'transfer'">转账</el-button>
          <el-button type="text" @click="currentTabCompnent = 'delegatebw'">抵押EOS</el-button>
          <el-button type="text" @click="currentTabCompnent = 'undelegatebw'">取消抵押EOS</el-button>
          <el-button type="text" @click="showDialog">退款</el-button>
          <el-button type="text" @click="currentTabCompnent = 'buyram'">购买ram</el-button>
          <el-button type="text" @click="currentTabCompnent = 'sellram'">出售ram</el-button>
          <el-button type="text" @click="currentTabCompnent = 'bidname'">竞价账户</el-button>

          <el-dialog
            title="退款（取消抵押的EOS退回到账户余额）"
            :visible.sync="dialogVisible"
            width="40%">
            <h4 style="margin-top: 0;">请选择需退回的账号名</h4>
            <el-select v-model="accountName" filterable placeholder="请选择账户">
              <el-option
                v-for="name in accountNames"
                :key="name"
                :label="name"
                :value="name">
              </el-option>
            </el-select>
            <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="refund">确 定</el-button>
            </span>
          </el-dialog>
        </el-card>
        <transition name="fade" mode="out-in">
          <component :is="currentTabCompnent"></component>
        </transition>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import {errorHelper} from '@/utils/helper'

export default {
  name: 'wallet',
  components: {
    'transfer': () => import('./transfer'),
    'delegatebw': () => import('./delegatebw'),
    'undelegatebw': () => import('./undelegatebw'),
    'currency-balance': () => import('./currencyBalance'),
    'buyram': () => import('./buyram'),
    'sellram': () => import('./sellram'),
    'bidname': () => import('./bidname')
  },
  data () {
    return {
      currentTabCompnent: 'transfer',
      loading: null,
      dialogVisible: false,
      accountName: '',
      eosmonitorTransaction: 'https://eosmonitor.io/txn',
      eosmonitorAccount: 'https://eosmonitor.io/account'
    }
  },
  methods: {
    showDialog () {
      this.dialogVisible = true
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
    refund () {
      if (this.accountName === '') {
        this.$message.warning('请选择退款账号！')
        return false
      }
      this.openFullScreenLoading()
      this.network().refund({owner: this.accountName})
        .then(res => {
          /* eslint-disable camelcase */
          let { transaction_id } = res
          this.loading.close()
          this.$notify({
            title: '退款成功',
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
            title: '退款失败',
            message: `
            <p>可能的原因</p>
            <ol>
              <li>退款账户不存在</li>
              <li>取消抵押时间间隔未到三天</li>
            </ol>
            <br>
            前往查看账户详情： <a href="${this.eosmonitorAccount}/${this.accountName}" target="_blank">${this.accountName}<a>
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
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
