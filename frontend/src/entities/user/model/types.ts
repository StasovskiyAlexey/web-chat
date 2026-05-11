import type { paths } from "@/app/types/paths"

export type TUser = paths['/api/v1/auth/check_user']['get']['responses']['200']['content']['application/json']['data']

export type TUserLogin = {
  login: string
  password: string
}

export type TUserRegister = {
  login: string
  email: string
  password: string
}