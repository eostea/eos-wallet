<template>
  <div class="container">
    <el-row>
      <el-col :xs="24" :sm="22" :lg="14" :push="1">
        <el-card>
          <el-form :rules="rules" :model="form" ref="form">
            <el-form-item label="设置端点">
              <el-row type="flex">
                <el-col :span="18">
                  <el-input v-model="form.httpEndpoint" placeholder="一般为url+端口"></el-input>
                </el-col>
                <el-col :span="4" :push="2">
                  <el-button type="primary" @click="checkLinkAndSetChainId">测试连接</el-button>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="过期时间">
              <el-input v-model="form.expireInSeconds" placeholder="默认为60秒"></el-input>
            </el-form-item>
            <el-form-item label="广播(可选)">
              <el-radio v-model="form.broadcast" :label="true">true</el-radio>
              <el-radio v-model="form.broadcast" :label="false">false</el-radio>
            </el-form-item>
            <el-form-item label="广播">
              <el-radio v-model="form.sign" :label="true">true</el-radio>
              <el-radio v-model="form.sign" :label="false">false</el-radio>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSubmit('form')">确定配置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="22" :lg="6" :push="1" class="aside-spaceing">
        <el-card style="color: #909399;">
          <h3 style="color: #2c3e50;">端点列表</h3>
          <ol>
            <li>https://eosio.tc.ink</li>
          </ol>
          <p>如果你有http端点，请发邮件联系support@tclabs.tech</p>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {mapActions} from 'vuex'
export default {
  name: 'setting',
  data () {
    return {
      form: {
        chainId: '', // 32 byte (64 char) hex string
        httpEndpoint: 'https://eosio.tc.ink',
        expireInSeconds: 60,
        broadcast: true,
        debug: false,
        sign: true
      },
      rules: {
        httpEndpoint: {required: true, message: '请选择http端点', trigger: 'blur'},
        expireInSeconds: {required: true, message: '设置过期时间', trigger: 'blur'}
      },
      loading: null,
      setChainId: false
    }
  },
  methods: {
    ...mapActions([
      'setEOSNetConfig',
      'connectEOSNet'
    ]),
    checkLinkAndSetChainId () {
      if (this.form.httpEndpoint === '') {
        this.$message.warning('请输入端点')
        return
      }
      this.openFullScreenLoading()
      let config = {
        httpEndpoint: this.form.httpEndpoint
      }
      let eos = this.$eosjs(config)
      eos.getInfo({})
        .then(res => {
          // eslint-disable-next-line
          let {chain_id} = res
          // eslint-disable-next-line
          this.form.chainId = chain_id
          this.setChainId = true
          this.loading.close()
          this.$message.success('连接可用')
        })
        .catch(e => {
          console.log(e)
          this.loading.close()
          this.setChainId = false
          this.$message.error('测试失败')
        })
    },
    handleSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (!this.setChainId) {
          this.$message.warning('请先测试网络连接')
          return false
        }
        if (valid) {
          this.setEOSNetConfig(this.form)
          this.connectEOSNet()
          this.$message.success('配置设置成功')
          this.$router.go(-1)
        } else {
          this.$message.warning('填写有误')
          console.log('error submit!!')
          return false
        }
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
@media (max-width: 1199px) {
  .aside-spaceing {
    margin-top: 20px;
  }
}
@media (min-width: 1200px) {
  .aside-spaceing {
    margin-left: 20px;
  }
}
</style>
