<template>

  <div class="container">
    <el-row>
      <el-col :xs="24" :sm="22" :lg="14" :push="1">
        <el-card>

        </el-card>
      </el-col>
      <el-col :lg="6" :push="2" class="hidden-md-and-down">
        <el-card style="color: #909399;">
          <h3 style="color: #2c3e50;">提示：</h3>

        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'staked',
  data () {
    return {}
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
