import './style.sass'
import { mountVue } from '@/utils'
import App from './App.vue'
import { login } from '@/api/user'

login({ password: 123456 }).then(data => {
  console.log(data)
})

mountVue({ component: App, el: '#app' })
