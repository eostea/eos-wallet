<template>
  <div class="name">
    <button @click="getCurrencyBalance">test</button>
  </div>
</template>

<script>
/* eslint-disable */
import { mapState } from 'vuex'
import {errorHelper} from '@/utils/helper'

export default {
  name: 'test',
  data () {
    return {
    }
  },
  mounted () {
  },
  methods: {
    network () {
      let config = Object.assign(
        {
          keyProvider: this.privateKey
        },
        this.eosConfig
      )
      return this.$eosjs(config)
    },
    getCurrencyBalance () {
      let config = Object.assign(
        {
          keyProvider: this.privateKey
        },
        this.eosConfig
      )
      // vote
      let params = {
        voter: "555555555555",
        proxy: '',
        producers: ['eosteaeostea']
      }
      // getProducers
      let b = {
        "json": true,
        "lower_bound": "12",
        "limit": 10
      }
      // get table
      let t = {
        json: true,
        "code": "eosio",
        "scope": "eosio",
        "table": "producers"
      }
      let network = this.$eosjs(config)
      network.voteproducer(params)
          .then(result => {
            console.log(result)
          })
          .catch(e => this.$message.error(errorHelper(e)))

      // .getCurrencyBalance()
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
