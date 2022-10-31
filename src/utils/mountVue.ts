import { createApp, Component } from 'vue'
import { createPinia } from 'pinia'
import router from '@/router'

const pinia = createPinia()
export default function ({
  component,
  el = document.createElement('div'),
}: {
  component: Component
  el: Element | string
}) {
  const instance = createApp(component).use(pinia).use(router)
  instance.mount(el)
  return instance
}
