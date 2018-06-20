<template>
  <div class="container">
    <el-row>
      <el-col :xs="24" :sm="22" :lg="14" :push="1">
        <el-card>
          <el-button type="text" @click="showDialogFormVisible">
            {{ $t('account.btn_list.createAccount') }}
          </el-button>
          <el-button type="text" @click="dialogPubKeyVisible = true">
            {{ $t('account.btn_list.search_PK') }}
          </el-button>
          <el-button type="text" @click="dialogAccountNameVisible = true">
            {{ $t('account.btn_list.search_AN') }}
          </el-button>
          <el-button type="text" @click="dialogControlledAccountsVisible = true">
            {{ $t('account.btn_list.search_CA') }}
          </el-button>
        </el-card>
        <el-dialog :title="$t('account.createAccount.title')" :visible.sync="dialogFormVisible">
          <el-form label-width="120" :rules="rules" :model="form" ref="form" >
            <el-form-item :label="$t('account.createAccount.creator')" prop="creator">
              <el-select
                v-model="form.creator"
                filterable
                :placeholder="$t('account.createAccount.creator_placeholder')">
                <el-option
                  v-for="name in accountNames"
                  :key="name"
                  :label="name"
                  :value="name">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('account.createAccount.accountName')" prop="accountName">
              <el-input
                maxlength="12"
                v-model="form.accountName"
                :placeholder="$t('account.createAccount.accountName_placeholder')">
              </el-input>
            </el-form-item>
            <el-form-item :label="$t('account.createAccount.owner')" prop="owner">
              <el-input v-model="form.owner" :placeholder="$t('account.createAccount.owner_placeholder')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('account.createAccount.active')" prop="active">
              <el-input v-model="form.active" :placeholder="$t('account.createAccount.active_placeholder')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('account.createAccount.bytes')" prop="bytes">
              <el-input v-model="form.bytes" :placeholder="$t('account.createAccount.bytes_placeholder')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('account.createAccount.net')" prop="stake_net_quantity">
              <el-input v-model="form.stake_net_quantity" :placeholder="$t('account.createAccount.net_placeholder')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('account.createAccount.cpu')" prop="stake_cpu_quantity">
              <el-input v-model="form.stake_cpu_quantity" :placeholder="$t('account.createAccount.cpu_placeholder')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('account.createAccount.transfer')">
              <el-radio v-model="form.transfer" :label="1">true</el-radio>
              <el-radio v-model="form.transfer" :label="0">false</el-radio>
              <p> {{ $t('account.createAccount.transfer_tips') }}</p>
            </el-form-item>
            <el-form-item>
              <el-button
                @click="handleCreateNewAccount('form')"
                type="primary">
                {{ $t('account.createAccount.createNewAccount') }}
              </el-button>
              <el-button
                @click="resetForm('form')"
                type="ghost">
                {{ $t('account.createAccount.resetForm') }}
              </el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
        <!-- Search Public Key -->
        <el-dialog :title="$t('account.searchAccountPubKey.title')" :visible.sync="dialogPubKeyVisible">
          <el-input
            type="text"
            v-model="dialogPubKey"
            :placeholder="$t('searchAccountPubKey.placeholder')">
          </el-input>
          <el-button
            type="primary"
            style="margin-top: 40px;"
            @click="getAccountsByKey">
            {{ $t('searchAccountPubKey.btn') }}
          </el-button>
        </el-dialog>
        <!-- Search Account Name 账户名查询 -->
        <el-dialog :title="$t('account.searchAccountName.title')" :visible.sync="dialogAccountNameVisible">
          <el-input
            type="text"
            maxlength="12"
            v-model="dialogAccountName"
            :placeholder="$t('account.searchAccountName.placeholder')">
          </el-input>
          <el-button
            type="primary"
            style="margin-top: 40px;"
            @click="getAccountByName">
            {{ $t('account.searchAccountName.btn') }}
          </el-button>
        </el-dialog>
        <!-- Search controll account -->
        <el-dialog :title="$t('account.searchControllAccount.title')" :visible.sync="dialogControlledAccountsVisible">
          <el-input type="text" maxlength="12" v-model="dialogControlledAccounts" :placeholder="$t('account.searchControllAccount.placeholder')"></el-input>
          <el-button
            type="primary"
            style="margin-top: 40px;"
            @click="getControlledAccountsByName">
            {{ $t('account.searchControllAccount.btn') }}
          </el-button>
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
                  <p>NET 权重：{{ props.row.total_resources.net_weight }} / 自身抵押：{{ props.row.self_delegated_bandwidth.net_weight }}</p>
                  <p>CPU 权重：{{ props.row.total_resources.cpu_weight }} / 自身抵押：{{ props.row.self_delegated_bandwidth.cpu_weight }}</p>
                  <p>可用RAM：{{ props.row.total_resources.ram_bytes }} bytes / 已用：{{ props.row.ram_usage }} bytes</p>
                  <p v-if="props.row.refund_request">
                    退还EOS资源请求：
                    CPU <span>{{ props.row.refund_request.cpu_amount }}</span> /
                    NET <span>{{ props.row.refund_request.net_amount }}</span>
                    <i class="el-icon-arrow-right" style="color: green;font-weight: 800;"></i>
                    <span>{{ props.row.refund_request.owner }}</span>
                    (<span>{{ props.row.refund_request.request_time }}</span>)
                  </p>
                </el-form-item>
              </el-form>
              <el-form v-if="props.row.delegated_bandwidth">
                <el-form-item>
                  <h3>抵押带宽</h3>
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
                      此公钥相关账户：
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
            prop="net_weight"
            label="网络权重">
          </el-table-column>
          <el-table-column
            prop="net_weight"
            label="CPU权重">
          </el-table-column>
          <el-table-column
            prop="ram_quota"
            label="RAM份额">
          </el-table-column>
          <el-table-column
            prop="ram_usage"
            label="已用RAM">
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
          <p><i class="el-icon-star-on"></i> 当前私钥相关的账户</p>
          <p><i class="el-icon-star-off"></i> 当前私钥无关的账户</p>
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
      eosmonitorTransaction: 'https://eosmonitor.io/txn',
      eosmonitorAccounts: 'https://eosmonitor.io/accounts',
      eosmonitorAccount: 'https://eosmonitor.io/account'
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
        item.created = this.$dayjs(time).format('YYYY-MM-DD HH:mm:ss')
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
