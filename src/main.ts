import './style.sass'
import { mountVue } from '@/utils'
import App from './App.vue'
import { login } from '@/api/user'

login({ password: 123456 }).then(data => {
  console.log('0',data)
}).catch((data)=>{
  
  console.log('1',data)
})

mountVue({ component: App, el: '#app' })
