import type { TUser, TUserLogin, TUserRegister } from "@/types/user";
import { inject, injectable } from "inversify";
import { TTypes } from "../../../shared/di/types";
import type { IHttpClient } from "../../../shared/di/interfaces";
import type { TResponse } from "@/app/types/response";
import type { TUserUpdateSchema } from "@/types/schemas";

@injectable()
export class AuthService {
  constructor(@inject(TTypes.HttpClient) private http: IHttpClient) {}

  async updateUser(userData: TUserUpdateSchema) {
    const res = await this.http.patch<TResponse<TUser>>('users/update_user', {
      login: userData.login,
      email: userData.email,
      new_password: userData.new_password,
      password: userData.password
    })
    return res.data
  }

  async me() {
    try {
      const res = await this.http.get<TResponse<TUser>>('auth/check_user')
      return res.data  
    } catch (e) {
      console.log(e)
    }
  }

  async login(data: TUserLogin) {
    const res = await this.http.post<TResponse<TUser>>('auth/login_user', {
      login: data.login,
      password: data.password
    })
    return res.data  
  }

  async register(data: TUserRegister) {
    const res = await this.http.post<TResponse<TUser>>('auth/register_user', {
      login: data.login,
      email: data.email,
      password: data.password
    })
    return res.data 
  }

  async logout() {
    const res = await this.http.get<TResponse<TUser>>('auth/logout')
    return res.data
  }
}

export type TAuthService = AuthService