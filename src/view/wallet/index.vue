<template>
  <div class="container">
    <el-row>
      <el-col :xs="24" :sm="22" :lg="14" :push="1">
        <el-card>
          <el-button type="text" @click="currentTabCompnent = 'transfer'">转账</el-button>
          <el-button type="text" @click="currentTabCompnent = 'delegatebw'">委托EOS</el-button>
          <el-button type="text" @click="currentTabCompnent = 'undelegatebw'">取消委托EOS</el-button>
          <el-button type="text" @click="currentTabCompnent = 'currency-balance'">抵押EOS</el-button>
          <el-button type="text" @click="currentTabCompnent = 'buyram'">购买ram</el-button>
        </el-card>
        <transition name="fade" mode="out-in">
          <component :is="currentTabCompnent"></component>
        </transition>
      </el-col>

      <el-col :xs="24" :sm="22" :lg="6" :push="1" class="aside-spaceing">
        <el-card style="color: #909399;" class="hidden-md-and-down">
          <h3 style="color: #2c3e50;">提示：</h3>
          <ol>
            <li>账号格式 1-5 a-z</li>
            <li>代币数量格式 数量+空格+符号</li>
          </ol>
        </el-card>
        <currency-balance></currency-balance>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'wallet',
  components: {
    'transfer': () => import('./transfer'),
    'delegatebw': () => import('./delegatebw'),
    'undelegatebw': () => import('./undelegatebw'),
    'currency-balance': () => import('./currencyBalance'),
    'buyram': () => import('./buyram')
  },
  data () {
    return {
      currentTabCompnent: 'transfer'
    }
  },
  methods: {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-card + .el-card {
  margin-top: 20px;
}
@media (min-width: 1200px) {
  .aside-spaceing {
    margin-left: 20px;
  }
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
