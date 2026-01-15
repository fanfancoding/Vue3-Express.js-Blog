/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'virtual:uno.css' {
  const css: string
  export default css
}

declare module 'i18n-jsautotranslate' {
  const translate: any
  export default translate
}

declare module 'md5' {
  function md5(data: string): string
  export default md5
}
