<template>
  <div class="container">
    <el-row>
      <el-col :xs="24" :sm="22" :lg="14" :push="1">
        <el-card>
          <el-button type="text" @click="showDialogFormVisible">创建账号</el-button>
          <el-button type="text" @click="dialogPubKeyVisible = true">公钥查询</el-button>
          <el-button type="text" @click="dialogAccountNameVisible = true">账户名查询</el-button>
          <el-button type="text" @click="dialogControlledAccountsVisible = true">查询拥有的账户</el-button>
        </el-card>
        <el-dialog title="创建账户" :visible.sync="dialogFormVisible">
          <el-form label-width="120" :rules="rules" :model="form" ref="form" >
            <el-form-item label="账户" prop="creator">
              <el-select v-model="form.creator" filterable placeholder="请选择">
                <el-option
                  v-for="name in accountNames"
                  :key="name"
                  :label="name"
                  :value="name">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="新账户" prop="accountName">
              <el-input maxlength="12" v-model="form.accountName" placeholder="新账户的名字"></el-input>
            </el-form-item>
            <el-form-item label="owner key" prop="owner">
              <el-input v-model="form.owner" placeholder="owner 公钥"></el-input>
            </el-form-item>
            <el-form-item label="active key" prop="active">
              <el-input v-model="form.active" placeholder="active 公钥"></el-input>
            </el-form-item>
            <el-form-item label="购买存贮空间大小" prop="bytes">
              <el-input v-model="form.bytes" placeholder="单位为 bytes"></el-input>
            </el-form-item>
            <el-form-item label="委托net数量 -- 例: 100.00 EOS" prop="stake_net_quantity">
              <el-input v-model="form.stake_net_quantity" placeholder="占用EOS网络中的NET资源"></el-input>
            </el-form-item>
            <el-form-item label="委托cpu数量 -- 例: 100.00 EOS" prop="stake_cpu_quantity">
              <el-input v-model="form.stake_cpu_quantity" placeholder="占用EOS网络中的CPU资源"></el-input>
            </el-form-item>
            <el-form-item label="transfer">
              <el-radio v-model="form.transfer" :label="1">true</el-radio>
              <el-radio v-model="form.transfer" :label="0">false</el-radio>
              <p>(请注意！！！transfer 设置为 true 时，委托的EOS，无法撤消。设置为false，委托的EOS可以撤消 )</p>
            </el-form-item>
            <el-form-item>
              <el-button @click="handleCreateNewAccount('form')" type="primary">新建账号</el-button>
              <el-button @click="resetForm('form')" type="ghost">重置表单</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
        <!-- 公钥查询 -->
        <el-dialog title="通过公钥查询账户" :visible.sync="dialogPubKeyVisible">
          <el-input type="text" v-model="dialogPubKey"></el-input>
          <el-button type="primary" style="margin-top: 40px;" @click="getAccountsByKey">查询</el-button>
        </el-dialog>
        <!-- 账户名查询 -->
        <el-dialog title="通过账户名查询账户" :visible.sync="dialogAccountNameVisible">
          <el-input type="text" maxlength="12" v-model="dialogAccountName" placeholder="请输入账户名"></el-input>
          <el-button type="primary"  style="margin-top: 40px;" @click="getAccountByName">查询</el-button>
        </el-dialog>
        <!-- 通过账户名查询拥有的账户 -->
        <el-dialog title="通过账户名查询拥有的账户" :visible.sync="dialogControlledAccountsVisible">
          <el-input type="text" maxlength="12" v-model="dialogControlledAccounts" placeholder="请输入账户名"></el-input>
          <el-button type="primary"  style="margin-top: 40px;" @click="getControlledAccountsByName">查询</el-button>
        </el-dialog>
        <!-- table -->
        <el-table
          :data="cpAccountTable"
          style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" size="mini">
                <el-form-item>
                  <h3>总资源</h3>
                  <p>NET 权重：{{ props.row.total_resources.net_weight }}</p>
                  <p>CPU 权重：{{ props.row.total_resources.cpu_weight }}</p>
                  <p>可用RAM：{{ props.row.total_resources.ram_bytes }} (bytes)</p>
                </el-form-item>
              </el-form>
              <el-form v-if="props.row.delegated_bandwidth">
                <el-form-item>
                  <h3>委托带宽</h3>
                  <p>
                    from: {{ props.row.delegated_bandwidth.from }}
                    <i class="el-icon-caret-right"></i>
                    to: {{ props.row.delegated_bandwidth.to }}
                    | 网络权重: {{props.row.delegated_bandwidth.net_weight}} | CPU 权重: {{props.row.delegated_bandwidth.cpu_weight}}
                  </p>
                </el-form-item>
              </el-form>
              <el-form label-position="left" size="mini" inline class="table-expand">
                <el-form-item>
                  <h3>网络使用情况</h3>
                </el-form-item>
                <el-form-item></el-form-item> <!-- placeholder -->
                <el-form-item label="已用NET">
                  <span>{{ props.row.net_limit.used }}</span>
                </el-form-item>
                <el-form-item label="已用CPU">
                  <span>{{ props.row.cpu_limit.used }}</span>
                </el-form-item>
                <el-form-item label="可得">
                  <span>{{ props.row.net_limit.available }}</span>
                </el-form-item>
                <el-form-item label="可得">
                  <span>{{ props.row.cpu_limit.available }}</span>
                </el-form-item>
                <el-form-item label="最大可用">
                  <span>{{ props.row.net_limit.max }}</span>
                </el-form-item>
                <el-form-item label="最大可用">
                  <span>{{ props.row.cpu_limit.max }}</span>
                </el-form-item>
              </el-form>
              <template v-for="(item, pIndex) in props.row.permissions">
                <el-form label-position="left" size="mini" :key="pIndex">
                  <el-form-item>
                    <h3>账户{{ item.perm_name }}权限</h3>
                    <p>阀值：{{ item.required_auth.threshold }}</p>
                    <p v-for="(key, kIndex) in item.required_auth.keys" :key="kIndex">
                    weight: {{ key.weight }} / key: {{ key.key }}
                    </p>
                    <p>parent: <strong style="color: #4285f4;">{{ item.parent }}</strong> </p>
                    <p>
                      此公钥相关账号：
                      <el-tag
                        v-for="(account, aIndex) in item.accounts"
                        :key="aIndex"
                        size="mini"
                        color="#F2FAFE"
                        :hit="false">{{ account }}</el-tag>
                    </p>
                  </el-form-item>
                </el-form>
              </template>
              <el-form v-if="props.row.voter_info">
                <el-form-item>
                  <h3>账户投票信息</h3>
                  <p>抵押：{{ props.row.voter_info.staked / 10000 }} EOS</p>
                  <p>
                    已投的生产者：
                    <el-tag
                      type="success"
                      size="mini"
                      v-for="name in props.row.voter_info.producers"
                      :key="name">{{ name }}</el-tag>
                  </p>
                  <hr>
                  <p>最后一次投票权重：{{ props.row.voter_info.last_vote_weight }}</p>
                  <p>取消抵押：{{ props.row.voter_info.unstaking }}</p>
                  <p>最后一次取消抵押时间：{{ props.row.voter_info.last_unstake_time }}</p>
                  <p>deferred_trx_id： {{ props.row.voter_info.is_proxy }}</p>
                  <p v-if="props.row.voter_info.is_proxy === 1">
                    是否已代理：{{ props.row.voter_info.is_proxy === 0 ? '否' : '是' }}
                  </p>
                  <template v-if="props.row.voter_info.is_proxy === 1">
                    <p>代理账户：{{ props.row.voter_info.proxy }}</p>
                    <p>代理投票权重：</p>
                  </template>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            prop="account_name"
            label="账户">
          </el-table-column>
          <el-table-column
            prop="created"
            label="创建时间"
            width="180">
          </el-table-column>
          <el-table-column
            prop="ram_quota"
            label="RAM份额">
          </el-table-column>
          <el-table-column
            prop="net_weight"
            label="网络权重">
          </el-table-column>
          <el-table-column
            prop="net_weight"
            label="CPU权重">
          </el-table-column>
          <el-table-column
            prop="ram_usage"
            label="RAM使用率">
          </el-table-column>
          <el-table-column
            label="标识">
            <template slot-scope="props">
              <i class="el-icon-star-on" v-if="props.row.private"></i>
              <i class="el-icon-star-off" v-else></i>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :lg="6" :push="2" class="hidden-md-and-down">
        <el-card style="color: #909399;">
          <h3 style="color: #2c3e50;">提示：</h3>
          <p><i class="el-icon-star-on"></i> 当前私钥相关的账号</p>
          <p><i class="el-icon-star-off"></i> 当前私钥无关的账号</p>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import {errorHelper} from '@/utils/helper'

export default {
  name: 'account',
  data () {
    let { ecc } = this.$eosjs.modules
    let validateAccountName = function (rule, val, cb) {
      let re = /^[1-5a-z]+$/g
      if (val === '') {
        cb(new Error('请输入新建账户名'))
      } else if (!re.test(val)) {
        cb(new Error('名字只能包含 1-5 a-z!'))
      } else {
        cb()
      }
    }
    let validateEOSKey = function (rule, val, cb) {
      if (val === '') {
        cb(new Error('请输入合法的 Key!'))
      } else if (!ecc.isValidPublic(val)) {
        cb(new Error('Key 格式错误，请检查!'))
      } else {
        cb()
      }
    }
    let validateBytes = function (rule, val, cb) {
      if (val === '') {
        cb(new Error('请输入 Bytes!'))
      } else if (Number.isNaN(Number(val))) {
        cb(new Error('Bytes 必须为纯数字'))
      } else {
        cb()
      }
    }

    return {
      accountTable: [],
      dialogFormVisible: false,
      dialogPubKeyVisible: false,
      dialogPubKey: '',
      dialogAccountNameVisible: false,
      dialogAccountName: '',
      dialogControlledAccountsVisible: false,
      dialogControlledAccounts: '',

      loading: null,

      form: {
        creator: '',
        accountName: '',
        owner: '',
        active: '',
        bytes: 8192,
        stake_net_quantity: '',
        stake_cpu_quantity: '',
        transfer: 0
      },
      rules: {
        creator: {required: true, message: '请选择账户', trigger: 'change'},
        accountName: {required: true, validator: validateAccountName, trigger: 'blur'},
        owner: {required: true, validator: validateEOSKey, trigger: 'blur'},
        active: {required: true, validator: validateEOSKey, trigger: 'blur'},
        bytes: {required: true, validator: validateBytes, trigger: 'blur'},
        stake_net_quantity: {required: true, trigger: 'blur'},
        stake_cpu_quantity: {required: true, trigger: 'blur'}
      },
      eosmonitorTransaction: 'https://party.eosmonitor.io/txn',
      eosmonitorAccounts: 'https://party.eosmonitor.io/accounts',
      eosmonitorAccount: 'https://party.eosmonitor.io/account'
    }
  },
  methods: {
    showDialogFormVisible () {
      if (!this.key) {
        this.$message.warning('请先导入秘钥！')
        this.$router.push({
          path: '/importkeys',
          query: { redirect: this.$router.currentRoute.fullPath }
        })
      } else {
        this.dialogFormVisible = true
      }
    },
    getAccountListInfo (nameList) {
      this.openFullScreenLoading()
      let promiseArr = nameList.map(item => {
        return this.getAccountInfo(item)
      })
      this.accountTable = []
      promiseArr.forEach(item => {
        item.then(res => {
          item.private = this.checkAccountIsPrivate(item.account_name) // placeholder
          this.accountTable.push(Object.assign({}, res))
          this.dialogPubKeyVisible = false // close dialog
          this.loading.close()
        })
          .catch(e => {
            this.loading.close()
            this.$message.error('获取数据失败')
            console.log(e)
          })
      })
    },
    getAccountInfo (accountName) {
      return this.network.getAccount({account_name: accountName})
    },
    getAccountInfoByKey (pubKey) {
      return this.network.getKeyAccounts(pubKey)
    },
    getControlledAccounts (accountName) {
      return this.network.getControlledAccounts({controlling_account: accountName})
    },
    closeDialogForm () {
      this.dialogFormVisible = false
    },
    getAccountsByKey () {
      let { ecc } = this.$eosjs.modules
      if (this.dialogPubKey !== '' && ecc.isValidPublic(this.dialogPubKey)) {
        this.getAccountInfoByKey(this.dialogPubKey)
          .then(res => {
            this.getAccountListInfo(Object.assign([], res.account_names))
          })
          .catch(e => {
            this.$message.error('查询失败')
            console.log(e)
          })
      } else {
        this.$message.warning('请输入合法的公钥！')
      }
    },
    getAccountByName () {
      if (this.dialogAccountName !== '' && this.dialogAccountName.length <= 12) {
        this.openFullScreenLoading()
        this.getAccountInfo(this.dialogAccountName)
          .then(info => {
            let account = Object.assign({}, info)
            account.private = this.checkAccountIsPrivate(account.account_name)
            this.accountTable = [account]
            this.dialogAccountNameVisible = false
            this.$message.success('查询成功')
            this.loading.close()
          })
          .catch(e => {
            this.loading.close()
            console.log(e)
            this.$message.error('查询失败')
          })
      } else {
        this.$message.warning('请输入正确的账户名')
      }
    },
    getControlledAccountsByName () {
      if (this.dialogControlledAccounts !== '' && this.dialogControlledAccounts.length <= 12) {
        this.openFullScreenLoading()
        this.getControlledAccounts(this.dialogControlledAccounts)
          .then(res => {
            this.getAccountListInfo(Object.assign([], res.controlled_accounts))
            this.dialogControlledAccountsVisible = false
            this.$message.success('查询成功')
            this.loading.close()
          })
          .catch(e => {
            this.loading.close()
            console.log(e)
            this.$message.error('查询失败')
          })
      } else {
        this.$message.warning('请输入正确的账户名')
      }
    },
    checkAccountIsPrivate (name) {
      let bool = this.accountNames && this.accountNames.some(item => item === name)
      return bool
    },
    checkAccountIsHave (account, arr) {
      let index, bool
      bool = arr.some((item, i) => {
        index = i
        return account.account_name === item.account_name
      })
      return {
        index: index,
        bool: bool
      }
    },
    handleCreateNewAccount (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.openFullScreenLoading()
          this.createNewAccount()
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
    createNewAccount () {
      let config = Object.assign(
        {
          keyProvider: this.key.priKeys
        },
        this.eosConfig
      )
      let eos = this.$eosjs(config)
      eos.transaction(tr => {
        tr.newaccount({
          creator: this.form.creator,
          name: this.form.accountName,
          owner: this.form.owner,
          active: this.form.active
        })
        tr.buyrambytes({
          payer: this.form.creator,
          receiver: this.form.accountName,
          bytes: Number(this.form.bytes)
        })
        tr.delegatebw({
          from: this.form.creator,
          receiver: this.form.accountName,
          stake_net_quantity: this.form.stake_net_quantity,
          stake_cpu_quantity: this.form.stake_cpu_quantity,
          transfer: this.form.transfer
        })
      })
        .then(res => {
          /* eslint-disable camelcase */
          let { transaction_id } = res
          this.loading.close()
          this.$notify({
            title: '创建成功',
            message: `
            <p>接下来可以</p>
            <a href="${this.eosmonitorTransaction}/${transaction_id}" target="_blank">前往查看浏览器操作详情<a>
            `,
            duration: 0,
            type: 'success',
            dangerouslyUseHTMLString: true
          })
        })
        .catch(e => {
          // error tips
          this.$message.error(errorHelper(e))
          this.loading.close()
          this.$notify({
            title: '失败原因',
            message: `
            <ol>
              <li>1. 输入格式错误</li>
              <li>2. 账户余额不足</li>
              <li>3. 账户名字已存在</li>
            </ol>
            <br>
            前往查看账户余额： <a href="${this.eosmonitorAccount}/${this.form.creator}" target="_blank">${this.form.creator}<a>
            <br>
            前往查看账户是否被占用：<a href="${this.eosmonitorAccounts}" target="_blank">${this.form.accountName}<a>
            `,
            duration: 0,
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
      key: state => state.key,
      accountNames: state => state.accountNames,
      network: state => state.eos,
      eosConfig: state => state.eosConfig
    }),
    cpAccountTable () {
      let accountArr = Object.assign([], this.accountTable)
      accountArr = accountArr.map(item => {
        let time = new Date(item.created)
        let timeZoneOffset = time.getTimezoneOffset() * 60 * 1000
        item.created = this.$dayjs(time - timeZoneOffset).format('YYYY-MM-DD HH:mm:ss')
        return item
      })
      return accountArr
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.table-expand {
  font-size: 0;
}
.table-expand label {
  width: 90px;
  color: #99a9bf;
}
.table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.el-form-item p{
  margin: 0;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
</style>
