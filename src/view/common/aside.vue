<template>
    <el-menu
      :router="true"
      :default-active="defaultActive"
      class="aside-main"
      text-color="#263C4F"
      background-color="#FFFFFF"
      active-text-color="#2a77cb">
      <div class="logo">
        <a href="">
          <img src="@/assets/EOSTEA.png" alt="EOSTEA logo">
        </a>
      </div>
      <el-menu-item index="0" :route="{path: 'createkeys'}">
        <i class="el-icon-plus"></i>
        <span slot="title">密钥</span>
      </el-menu-item>
       <el-menu-item index="1" :route="{path: 'account'}">
        <i class="el-icon-setting"></i>
        <span slot="title">账号</span>
      </el-menu-item>
      <el-menu-item index="2" :route="{path: 'wallet'}">
        <i class="el-icon-refresh"></i>
        <span slot="title">转账</span>
      </el-menu-item>
      <!-- <el-menu-item index="3" :route="{path: 'staked'}">
        <i class="el-icon-refresh"></i>
        <span slot="title">抵押</span>
      </el-menu-item> -->
      <el-menu-item index="4" :route="{path: 'votes'}">
        <i class="el-icon-tickets"></i>
        <span slot="title">投票</span>
      </el-menu-item>
      <el-menu-item index="5" :route="{path: 'setting'}">
        <i class="el-icon-setting"></i>
        <span slot="title">网络设置</span>
      </el-menu-item>
    </el-menu>
</template>

<script>
export default {
  name: 'asideContent',
  data () {
    return {
      defaultActive: '0'
    }
  },
  mounted (params) {
    this.setActiveBar()
  },
  methods: {
    setActiveBar () {
      let path = ['createkeys', 'account', 'wallet', 'staked', 'votes', 'setting']
      this.defaultActive = path.indexOf(this.$router.currentRoute.name).toString()
    }
  },
  watch: {
    '$route' () {
      this.setActiveBar()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.aside-main {
  height: 100vh;
  position: fixed;
}
.logo {
  text-align: center;
  background-color: #fff;
  width: 300px;
  border-bottom: 1px solid rgba(0,0,0,0.06);
  box-shadow: 0 5px 7px 0 rgba(0,0,0,0.06);
}
.logo img{
  width: 60px;
}
.header-logo {
  height: 56px;
  line-height: 56px;
  padding: 0 20px;
  text-align: center;
  margin-bottom: 10px;
  border-bottom: 1px solid #e4e7ed;
}
.el-menu-item:focus, .el-menu-item:hover {
  background-color: #f6f7fb !important;
}
</style>
