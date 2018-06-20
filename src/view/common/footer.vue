<template>
  <footer>
    <div>
      <p class="tips">{{ $t('footer.tips1') }}</p>
      <p class="tips">{{ $t('footer.tips2') }}<a href="https://github.com/eostea/eos-wallet" target="_blank">https://github.com/eostea/eos-wallet</a></p>
      <p class="tips">{{ $t('footer.tips3') }}</p>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'footerComponent',
  data () {
    return {
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.tips {
  margin: 0;
  padding: 10px;
}
</style>
