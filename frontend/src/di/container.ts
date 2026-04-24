import {Container} from 'inversify'
import { AxiosClient } from '@/api/AxiosClient'
import { AuthService, type TAuthService } from '@/services/auth.service'
import { TTypes } from './types'
import { type IHttpClient } from './interfaces'
import { ChatStore, type TChatStore } from '@/store/chat.store'
import { ChatService, type TChatService } from '@/services/chat.service'

const container = new Container()

container.bind<IHttpClient>(TTypes.HttpClient).toConstantValue(AxiosClient)
container.bind<TAuthService>(TTypes.AuthService).to(AuthService).inSingletonScope()
container.bind<TChatStore>(TTypes.ChatStore).to(ChatStore).inSingletonScope()
container.bind<TChatService>(TTypes.ChatService).to(ChatService).inSingletonScope()

export {container}