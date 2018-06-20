import {
  SETKEY,
  CONNECTEOSNET,
  SETACCOUNTNAMES,
  SETEOSNETCONFIG,
  SETLANG
} from './type'

const EOS = require('eosjs')
export default {
  setKey ({commit}, key) {
    commit(SETKEY, key)
  },
  connectEOSNet ({commit, state}) {
    return new Promise(function (resolve, reject) {
      if (state.key) {
        let config = Object.assign(
          {
            keyProvider: state.key.prikeys // WIF string or array of keys..
          },
          state.eosConfig
        )
        let eos = EOS(config)
        commit(CONNECTEOSNET, eos)
        resolve(eos)
      } else {
        let eos = EOS(state.eosConfig)
        commit(CONNECTEOSNET, eos)
        resolve(eos)
      }
    })
  },
  setAccountNames ({commit}, accountNames) {
    commit(SETACCOUNTNAMES, accountNames)
  },
  setEOSNetConfig ({commit}, config) {
    commit(SETEOSNETCONFIG, config)
  },
  setLang ({commit}, lang) {
    commit(SETLANG, lang)
    localStorage && localStorage.setItem('lang', lang)
  }
}
