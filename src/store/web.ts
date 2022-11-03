import { defineStore } from 'pinia'

export const useWebStore = defineStore('web', {
  state: () => {
    return {
      token: ''
    }
  },
})
