<template>
  <div class="container">
    <el-row>
      <el-col :xs="24" :sm="22" :lg="14" :push="1">
        <el-card
          class="card-item"
          v-loading="loading"
          element-loading-text="计算中"
          >
          <p>{{ $t('createKeys.publicKey') }}：{{ key.pubKeys }}</p>
          <p>{{ $t('createKeys.privateKey') }}：{{ key.priKeys }}</p>
        </el-card>
        <el-card class="card-item">
          <div slot="header" class="clearfix">
            <h1>{{ $t('createKeys.h1_1') }}<span style="color: #BE6A77;">{{ $t('createKeys.h1_1_span') }}</span></h1>
          </div>
          <el-form label-width="120">
            <el-form-item>
              <el-input v-model="seed" :placeholder="$t('createKeys.seed_placeholder')"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="createKeyBySeed">{{ $t('createKeys.btn_text') }}</el-button>
            </el-form-item>
          </el-form>
        </el-card>
        <el-card class="card-item">
          <div slot="header" class="clearfix">
            <h1>{{ $t('createKeys.h1_2') }}</h1>
          </div>
          <el-form label-width="120">
            <el-form-item>
              <el-button @click="createKeyByRandom">{{ $t('createKeys.btn_text')}}</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="22" :lg="6" :push="1" class="aside-spaceing">
        <el-card style="color: #909399;">
          <h3 style="color: #2c3e50;">{{ $t('createKeys.h3')}}</h3>
          <ol>
            <li>{{ $t('createKeys.li_1')}}</li>
            <li>{{ $t('createKeys.li_2')}}</li>
          </ol>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'createkeys',
  data () {
    return {
      seed: '',
      key: {
        pubKeys: '',
        priKeys: ''
      },
      loading: false
    }
  },
  mounted () {
  },
  methods: {
    createKeyBySeed () {
      this.startLoading()
      let {ecc} = this.$eosjs.modules
      if (this.seed.length < 128) {
        this.$notify(
          {
            title: '建议',
            message: '同一个种子每次产生相同的私钥。应该使用至少128个随机位来产生一个好的私钥。',
            offset: 80
          }
        )
      }
      this.key.priKeys = ecc.seedPrivate(this.seed)
      this.key.pubKeys = ecc.privateToPublic(this.key.priKeys)
      this.closeLoading()
    },
    createKeyByRandom () {
      let {ecc} = this.$eosjs.modules
      this.startLoading()
      ecc.randomKey().then(privateKey => {
        this.key.priKeys = privateKey
        this.key.pubKeys = ecc.privateToPublic(privateKey)
        this.closeLoading()
      })
    },
    startLoading () {
      this.loading = true
    },
    closeLoading () {
      setTimeout(() => {
        this.loading = false
      }, 500)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.card-item:nth-of-type(n) {
  margin-top: 20px;
}

h1 {
  margin: 0;
  color: #2c3e50;
}

.aside-spaceing {
  margin-top: 20px;
}

@media (min-width: 1200px) {
  .aside-spaceing {
    margin-left: 20px;
  }
}
</style>
