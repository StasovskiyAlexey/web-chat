import {Container} from 'inversify'
import { AxiosClient } from '../../app/api/axios-client'
import { AuthService, type TAuthService } from '@/features/auth/api/auth.service'
import { TTypes } from './types'
import { type IHttpClient } from './interfaces'
import { type TRoomService, RoomService } from '@/entities/room/api/room.service'
import { NotificationService, type TNotificationService } from '@/entities/notification/api/notifications.service'
import { UserService, type TUserService } from '@/entities/user/api/user.service'

const container = new Container()

// Сторы
container.bind<TRoomService>(TTypes.RoomService).to(RoomService).inSingletonScope()

// Сервисы
container.bind<TAuthService>(TTypes.AuthService).to(AuthService).inSingletonScope()
container.bind<TRoomService>(TTypes.ChatService).to(RoomService).inSingletonScope()
container.bind<TNotificationService>(TTypes.NotificationService).to(NotificationService).inSingletonScope()
container.bind<TUserService>(TTypes.UserService).to(UserService).inSingletonScope()

// Зависимости
container.bind<IHttpClient>(TTypes.HttpClient).toConstantValue(AxiosClient)

export {container}