<template>
  <div class="container">
    <el-row>
      <el-col :xs="24" :sm="22" :lg="14" :push="1">
        <el-card>
          <el-button type="text" @click="currentTabCompnent = 'votes'">节点投票</el-button>
          <el-button type="text" @click="currentTabCompnent = 'regproxy'">注册投票代理</el-button>
        </el-card>
        <transition name="fade" mode="out-in">
          <component :is="currentTabCompnent"></component>
        </transition>
      </el-col>

      <el-col :xs="24" :sm="22" :lg="6" :push="1" class="aside-spaceing">
        <el-card style="color: #909399;" class="hidden-md-and-down">
          <h3 style="color: #2c3e50;">提示：</h3>
          <ol>
            <li>节点投票一次可以投30个</li>
            <li>取消代理：在节点投票时设置代理人为空</li>
            <li>注册代理账号必须先注册成代理人</li>
          </ol>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'producers',
  components: {
    'votes': () => import('./votes'),
    'regproxy': () => import('./regproxy')
  },
  data () {
    return {
      currentTabCompnent: 'votes'
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
