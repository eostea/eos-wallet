<template>
  <div class="container">
    <el-row style="margin-top: 60px;margin-left: 120px;">
      <el-col :xs="22" :sm="18" :lg="12">
        <el-card>
          <el-form>
            <el-form-item>
              <el-input v-model="seed" type="password" placeholder="输入种子"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                @click="getPrivateKeyBySeed"
                type="primary">输入种子</el-button>
            </el-form-item>
          </el-form>
        </el-card>
        <h2>OR</h2>
        <el-card>
          <el-form>
            <el-form-item>
              <el-input v-model="privateKeys" type="password" placeholder="输入私钥"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                @click="getPrivateKey"
                type="primary"
                v-loading.fullscreen.lock="fullscreenLoading">输入私钥</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import {errorHelper} from '@/utils/helper'

export default {
  name: 'importkey',
  data () {
    return {
      fullscreenLoading: false,
      seed: '',
      privateKeys: '',
      key: {
        priKeys: '',
        pubKeys: ''
      }
    }
  },
  methods: {
    ...mapActions([
      'setKey',
      'connectEOSNet',
      'setAccountNames'
    ]),
    getPrivateKeyBySeed () {
      let {ecc} = this.$eosjs.modules
      this.fullscreenLoading = true
      this.key.priKeys = ecc.seedPrivate(this.seed)
      this.key.pubKeys = ecc.privateToPublic(this.key.priKeys)
      this.connectEOSNet()
        .then(eos => {
          eos.getKeyAccounts(this.key.pubKeys)
            .then(accountNames => {
              if (accountNames.length > 0) {
                this.setAccountNames(Object.assign([], accountNames)) // set account name list in store
                this.setKey(Object.assign({}, this.key)) // set key in store
                this.fullscreenLoading = false
                this.$message.success('连接EOS主网成功！')
                this.getRedirectPath() // back
              } else {
                this.fullscreenLoading = false
                this.$message.warning('该地址在网络中无账号，请先注册账号！')
              }
            })
            .catch(e => {
              this.fullscreenLoading = false
              console.log(e)
              this.$message.error('发生错误')
            })
        })
    },
    getPrivateKey () {
      let {ecc} = this.$eosjs.modules
      if (ecc.isValidPrivate(this.privateKeys) === true) {
        this.fullscreenLoading = true
        this.key.priKeys = this.privateKeys
        this.key.pubKeys = ecc.privateToPublic(this.key.priKeys)
        this.connectEOSNet()
          .then(eos => {
            eos.getKeyAccounts(this.key.pubKeys)
              .then(res => {
                if (res.account_names.length > 0) {
                  this.setAccountNames(Object.assign([], res.account_names)) // set account name list in store
                  this.setKey(Object.assign({}, this.key)) // set key in store
                  this.fullscreenLoading = false
                  this.$message.success('连接EOS主网成功！')
                  this.getRedirectPath() // back
                } else {
                  this.fullscreenLoading = false
                  this.$message.warning('该地址在网络中无账号，请先注册账号！')
                }
              })
              .catch(e => {
                this.fullscreenLoading = false
                this.$message.error(errorHelper(e))
                console.log(e)
              })
          })
      } else {
        this.$message.warning('输入的私钥格式错误！')
      }
    },
    getRedirectPath () {
      let { redirect } = this.$router.currentRoute.query
      if (redirect) {
        this.$router.replace({path: redirect})
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
