<template>
  <el-row :gutter="20">
    <el-col :span="7" :push="1">
      <h2>账号</h2>
      <ol>
        <li>创建账号</li>
        <li>搜索公钥相关账号</li>
        <li>搜索账号</li>
        <li>搜索控制的账号</li>
      </ol>
    </el-col>
    <el-col :span="7" :push="1">
      <h2>钱包</h2>
      <ol>
        <li>转账</li>
        <li>抵押EOS</li>
        <li>取消抵押EOS</li>
        <li>退款</li>
        <li>购买ram</li>
        <li>出售ram</li>
        <li>竞价账户名</li>
      </ol>
    </el-col>
    <el-col :span="7" :push="1">
      <h2>生产者</h2>
      <ol>
        <li>节点投票</li>
        <li>注册投票代理</li>
      </ol>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'name',
  data () {
    return {

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
