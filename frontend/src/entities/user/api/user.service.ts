import type { IHttpClient } from "@/shared/di/interfaces"
import { TTypes } from "@/shared/di/types"
import { inject, injectable } from "inversify"
import type { TUserUpdateSchema } from "../model/schemas"
import type { TResponse } from "@/app/types/response"
import type { TUser } from "../model/types"

@injectable()
export class UserService {
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

}

export type TUserService = UserService