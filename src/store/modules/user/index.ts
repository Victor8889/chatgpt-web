/*
 * @Author: lk
 * @LastEditTime: 2023-04-16 19:16:18
 * @FilePath: \wm-ai\src\store\modules\user\index.ts
 * @Description: 存储用户相关数据 用户名 github地址等
 */
import { defineStore } from 'pinia'
import type { UserInfo, UserState } from './helper'
import { defaultSetting, getLocalState, setLocalState } from './helper'
import { removeToken, toLogin } from '@/utils/auth'

import { getUserInfo } from '@/api/login'

export const useUserStore = defineStore('user-store', {
  state: (): UserState => getLocalState(),
  actions: {
    async getUserData() {
      const { data } = await getUserInfo()
      const newData = {
        avatar: data.avatarUrl,
        name: data.nickname,
        description: data.description,
        id: data.baseUserId,
        email: data.email,
      }
      this.updateUserInfo(newData)
    },

    updateUserInfo(userInfo: Partial<UserInfo>) {
      this.userInfo = { ...this.userInfo, ...userInfo }
      this.recordState()
    },

    resetUserInfo() {
      this.userInfo = { ...defaultSetting().userInfo }
      this.recordState()
    },

    async logout() {
      const { resetTabs } = useTabStore()
      const { resetPermission } = usePermissionStore()
      removeToken()
      resetPermission()
      resetTabs()
      resetRouter()
      this.$reset()
      toLogin()
    },
    recordState() {
      setLocalState(this.$state)
    },
  },
})
