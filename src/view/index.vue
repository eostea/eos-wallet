<template>
  <div class="index">
    <section class="container">
      <aside class="layout-aside">
          <aside-component></aside-component>
      </aside>
      <section class="layout-content">
        <header class="layout-header">
          <header-component></header-component>
        </header>
        <main class="layout-main">
          <transition name="component-fade" mode="out-in">
            <router-view></router-view>
          </transition>
        </main>
        <footer-component></footer-component>
      </section>
    </section>
  </div>
</template>

<script>
import headerComponent from '@/view/common/header'
import asideComponent from '@/view/common/aside'
import footerComponent from '@/view/common/footer'

export default {
  name: 'index',
  data () {
    return {
    }
  },
  components: {
    headerComponent,
    asideComponent,
    footerComponent
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.layout-content {
  padding-left: 300px;
  margin-bottom: 100px;
}
.layout-main {
  min-height: 80vh;
}
.component-fade-enter-active, .component-fade-leave-active {
  transition: opacity .3s ease;
}
.component-fade-enter, .component-fade-leave-to {
  opacity: 0;
}
</style>
