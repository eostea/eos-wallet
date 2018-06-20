<template>
  <header>
    <el-row>
      <el-col :xs="24" :sm="22" :lg="14" :push="1" class="container">
        <p class="header-tips">{{ $t('header.tips') }}</p>
        <el-dropdown trigger="click" @command="handleCommand">
          <span class="el-dropdown-link" style="color: #409eff;">
            Language<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="zh">中文</el-dropdown-item>
            <el-dropdown-item command="en">English</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-row>
    <div class="container">

    </div>
  </header>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'headerContent',
  methods: {
    ...mapActions([
      'setLang'
    ]),
    handleCommand (command) {
      this.setLang(command)
      console.log(this.$store.state.lang)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.header-tips {
  margin: 0;
}
.container {
  display: flex;
  padding: 20px;
  justify-content: space-between;
}
</style>
