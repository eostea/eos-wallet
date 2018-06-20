// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/display.css'
import {
  Container,
  Header,
  Aside,
  Main,
  Row,
  Col,
  Menu,
  Submenu,
  MenuItem,
  Input,
  Button,
  Card,
  Form,
  FormItem,
  Upload,
  Table,
  TableColumn,
  Progress,
  Tabs,
  TabPane,
  Message,
  Notification,
  Loading,
  Radio,
  Tag,
  Dialog,
  Select,
  Option,
  OptionGroup,
  Collapse,
  CollapseItem,
  Transfer,
  Dropdown,
  DropdownMenu,
  DropdownItem
} from 'element-ui'

Vue.prototype.$ELEMENT = { size: 'small', zIndex: 3000 }
Vue.prototype.$notify = Notification
Vue.prototype.$message = Message
Vue.prototype.$loading = Loading.service

Vue.use(Loading.directive)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Row)
Vue.use(Col)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Input)
Vue.use(Button)
Vue.use(Card)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Upload)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Progress)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Radio)
Vue.use(Tag)
Vue.use(Dialog)
Vue.use(Select)
Vue.use(Option)
Vue.use(OptionGroup)
Vue.use(Collapse)
Vue.use(CollapseItem)
Vue.use(Transfer)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
