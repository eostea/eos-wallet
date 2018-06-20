module.exports = {
  aside: {
    key: 'Create Keys',
    account: 'Account',
    wallet: 'Wallet',
    producers: 'Producers',
    setting: 'Setting'
  },
  header: {
    tips: 'Please take good care of your private key!'
  },
  footer: {
    tips1: 'EOS Chinese Community: eosteaeostea Please vote for us!',
    tips2: 'GitHub:',
    tips3: 'This application is hosted on github. The library used is eosjs provided by EOS.'
  },
  createKeys: {
    publicKey: 'Pubilce Key',
    privateKey: 'Private Key',
    h1_1: 'Create key pair by seed',
    h1_1_span: '(suggest)',
    seed_placeholder: 'The same seed produces the same private key each time',
    btn_text: 'Create a key pair',
    h1_2: 'Create a random key pair',
    h3: 'PS',
    li_1: 'Seed: A fixed string. It can be a sentence or a random string that will generate a pair of fixed EOS keys',
    li_2: 'The official repository used by the seed eosjs-ecc to generate'
  },
  setting: {
    form: {
      httpEndpoint: 'Set Endpoints',
      httpEndpoint_placeholder: 'usually url+port',
      expireInSeconds: 'Expiration time (unit: seconds)',
      expireInSeconds_placeholder: 'Default is 60 seconds',
      broadcast: 'Broadcast (optional)',
      sign: 'Signature',
      test: 'Test',
      connect: 'Connect Network'
    },
    tips: {
      h3: 'Endpoint List',
      contact: 'If you have a http endpoint, please email support@tclabs.tech'
    }
  },
  account: {
    btn_list: {
      createAccount: 'Create Account',
      search_PK: 'Search Public Key ',
      search_AN: 'Search Account Name',
      search_CA: 'Search Controll Account'
    },
    createAccount: {
      title: 'Create Account',
      creator: 'Account',
      creator_placeholder: 'please choose',
      accountName: 'new account name',
      accountName_placeholder: 'please input new account name',
      owner: 'owner key',
      owner_placeholder: 'piease input owner key',
      active: 'active key',
      active_placeholder: 'please input active key',
      bytes: 'buy bytes',
      bytes_placeholder: 'The unit is bytes',
      net: 'staked net',
      net_placeholder: '0.00 EOS',
      cpu: 'staked cpu',
      cpu_placeholder: '0.00 EOS',
      transfer: 'transfer',
      transfer_tips: '(Please note that when !!!transfer is set to true, the mortgaged EOS will go to the new account.)',
      createNewAccount: 'Create Account',
      resetForm: 'Reset form'
    }
  },
  searchAccountPubKey: {
    title: 'Searching Accounts Through Public Keys',
    placeholder: 'Please enter your username',
    btn: 'Search'
  },
  searchAccountName: {
    title: 'Search Account by Account Name',
    placeholder: 'please enter your username',
    btn: 'Search'
  },
  searchControllAccount: {
    title: 'Account controlled by account name search',
    placeholder: 'Please enter search account name',
    btn: 'Search'
  }
  // common
}
