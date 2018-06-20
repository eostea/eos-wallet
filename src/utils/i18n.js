import Vue from 'vue'
import VueI18n from 'vue-i18n'
import enLang from 'element-ui/lib/locale/lang/en'
import zhLang from 'element-ui/lib/locale/lang/zh-CN'
import ElementLocale from 'element-ui/lib/locale'
import en from '@/assets/lang/en'
import zh from '@/assets/lang/zh'

Vue.use(VueI18n)

function getLanguage () {
  let lang = 'en'
  if (navigator.language) {
    lang = navigator.language
  }
  return lang === 'en' ? 'en' : 'zh'
}

const messages = {
  en: {
    ...enLang,
    ...en
  },
  zh: {
    ...zhLang,
    ...zh
  }
}

const i18n = new VueI18n({
  local: getLanguage(),
  messages,
  fallbackLocale: 'en'
})

ElementLocale.i18n((key, value) => i18n.t(key, value))

export default i18n
