module.exports = {
  aside: {
    key: '创建秘钥',
    account: '账号',
    wallet: '钱包',
    producers: '节点',
    setting: '网络设置'
  },
  header: {
    tips: '请妥善保管好自己的私钥！！！'
  },
  footer: {
    tips1: 'EOS中文社区: eosteaeostea  请投票支持我们！',
    tips2: '项目开源地址：',
    tips3: '提示：本应用托管在github上，使用的库为EOS官方提供的 eosjs。'
  },
  createKeys: {
    publicKey: '公钥',
    privateKey: '私钥',
    h1: '通过种子创建秘钥对',
    h1_span: '（推荐）',
    seed_placeholder: '同一个种子每次产生相同的私钥',
    btn_text: '创建秘钥对',
    h1_2: '随机创建秘钥对',
    h3: '说明',
    li_1: '种子（seed）：一个固定的字符串。可以是一句话，也可以是随机字符串，会产生一对固定EOS秘钥',
    li_2: 'seed 使用的官方仓库 eosjs-ecc 来生成。'
  },
  setting: {
    form: {
      httpEndpoint: '设置端点',
      httpEndpoint_placeholder: '一般为url+端口',
      expireInSeconds_label: '过期时间(单位：秒)',
      expireInSeconds_placeholder: '默认为60秒',
      broadcast: '广播(可选)',
      sign: '签名',
      test: '测试连接',
      connect: '连接网络'
    },
    tips: {
      h3: '端点列表',
      contact: '如果你有http端点，请发邮件联系support@tclabs.tech'
    }
  },
  account: {
    btn_list: {
      createAccount: '创建账户',
      search_PK: '公钥搜索',
      search_AN: '搜索账户名',
      search_CA: '搜索控制的账户'
    },
    createAccount: {
      title: '创建账户',
      creator: '账户',
      creator_placeholder: '请选择',
      accountName: '新账户名称',
      accountName_placeholder: '新账户的名称',
      owner: 'owner key',
      owner_placeholder: 'owner 公钥',
      active: 'active key',
      active_placeholder: 'active 公钥',
      bytes: '购买存贮空间大小',
      bytes_placeholder: '单位为 bytes',
      net: '抵押net数量 -- 例: 10.00 EOS',
      net_placeholder: '占用EOS网络中的NET资源',
      cpu: '抵押cpu数量 -- 例: 100.00 EOS',
      cpu_placeholder: '占用EOS网络中的CPU资源',
      transfer: 'transfer',
      transfer_tips: '(请注意！！！transfer 设置为 true 时，抵押的EOS，会转到新账户。)',
      createNewAccount: '新建账户',
      resetForm: '重置表单'
    },
    searchAccountPubKey: {
      title: '通过公钥搜索账户',
      placeholder: '请输入规范的公钥，搜索账户',
      btn: '搜索'
    },
    searchAccountName: {
      title: '通过账户名搜索账户',
      placeholder: '请输入账户名',
      btn: '搜索'
    },
    searchControllAccount: {
      title: '通过账户名搜索控制的账户',
      placeholder: '请输入搜索账户名',
      btn: '搜索'
    }
  }
  // common
}
