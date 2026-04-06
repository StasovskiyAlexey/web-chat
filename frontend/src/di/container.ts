import {Container} from 'inversify'
import { AxiosClient } from '@/api/AxiosClient'
import { AuthService, type TAuthService } from '@/services/auth.service'
import { TTypes } from './types'
import { type IHttpClient } from './interfaces'

const container = new Container()

container.bind<IHttpClient>(TTypes.HttpClient).toConstantValue(AxiosClient)
container.bind<TAuthService>(TTypes.AuthService).to(AuthService).inSingletonScope()

export {container}