declare module '*.svg' {
  const content: any
  export default content
}

interface Window {
  dataLayer?: any[]
}

declare module 'platform-detect' {
  export const ios: any
  export const android: any
}

declare module 'axios-middleware' {
  export const Service: any
}
