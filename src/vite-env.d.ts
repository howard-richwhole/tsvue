/// <reference types="vite/client" />
/// <reference types="lodash" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent
  export default component
}

declare const _: LoDashStatic

interface Window {
  _: LoDashStatic
}