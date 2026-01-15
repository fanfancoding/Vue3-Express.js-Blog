/// <reference types="vite/client" />

declare module '*.vue' {
  import { ComponentOptions } from 'vue'
  const component: ComponentOptions
  export default component
}

declare module 'virtual:uno.css'

declare module 'i18n-jsautotranslate' {
  export function translateJsVueUseModel(): any
}

declare module 'md5' {
  export default function md5(value: string): string
}
