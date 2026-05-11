import {z} from "zod"

export type TUserUpdateSchema = z.infer<typeof userUpdateSchema>

export const userUpdateSchema = z.object({
  login: z.string().nonempty({message: 'Нельзя ввести пустое имя пользователя'}),
  email: z.string().nonempty({message: 'Нельзя ввести пустой email пользователя'}),
  password: z.string().optional(),
  new_password: z.string().optional(),
})

export const userLoginSchema = z.object({
  login: z.string().nonempty({message: 'Введите имя пользователя'}),
  password: z.string().nonempty({message: 'Введите пароль пользователя'}),
})

export const userRegisterSchema = z.object({
  login: z.string().nonempty({message: 'Введите имя пользователя'}),
  email: z.string().nonempty({message: 'Введите email пользователя'}),
  password: z.string().nonempty({message: 'Введите пароль пользователя'}),
})