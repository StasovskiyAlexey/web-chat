import { TTypes } from '@/di/types'
import type { TChatService } from '@/services/chat.service'
import type { TRoom, TRoomCreate } from '@/types/room'
import { AxiosError } from 'axios'
import { inject, injectable } from 'inversify'
import {makeAutoObservable, runInAction} from 'mobx'
import { toast } from 'react-toastify'

export enum EChatStore {
  fetchRooms = 'fetchRooms',
  fetchRoomById = 'fetchRoomById',
  createRoom = 'createRoom',
  updateRoom = 'updateRoom'
}

@injectable()
export class ChatStore {
  constructor(@inject(TTypes.ChatService) private chatService: TChatService) {
    makeAutoObservable(this)
  }

  isLoading = new Set<string>()
  isPending = new Set<string>()
  isError = new Set<string>()

  rooms: TRoom[] = []
  room: TRoom | null = null

  async fetchRooms() {
    this.isPending.add(EChatStore.fetchRooms)
    this.isLoading.add(EChatStore.fetchRooms)
    try {
      const res = await this.chatService.getRooms();
      console.log(res)
      runInAction(() => {
        this.rooms = res.data; 
      });
    } catch (e) {
      this.isError.add(EChatStore.fetchRooms);
    } finally {
      this.isPending.delete(EChatStore.fetchRooms)
      this.isLoading.delete(EChatStore.fetchRooms)
    }
  }

  async fetchRoomById(roomId: string) {
    this.isLoading.add(EChatStore.fetchRoomById);
    this.isPending.add(EChatStore.fetchRoomById)
    try {
      const res = await this.chatService.getRoom(roomId);
      console.log(res)
      runInAction(() => {
        this.room = res.data;
      });
    } catch (e) {
      if (e instanceof AxiosError) {
        toast.error(e.response?.data.detail)
      }
      this.isError.add(EChatStore.fetchRoomById);
    } finally {
      this.isPending.delete(EChatStore.fetchRoomById);
      this.isLoading.delete(EChatStore.fetchRoomById);
    }
  }

  async createRoom(data: TRoomCreate) {
    this.isLoading.add(EChatStore.createRoom);
    this.isPending.add(EChatStore.createRoom)
    try {
      const res = await this.chatService.createRoom(data);
      runInAction(() => {
        this.rooms.push(res.data);
      });
      console.log(res)
      toast.success(res.message)
      return res.data;
    } catch (e) {
      if (e instanceof AxiosError) {
        toast.error(e.response?.data.detail)
      }
      this.isError.add(EChatStore.createRoom);
    } finally {
      this.isPending.delete(EChatStore.createRoom);
      this.isPending.delete(EChatStore.createRoom)
    }
  }

  async updateRoom(roomId: string, name: string, type: string) {
    this.isLoading.add(EChatStore.updateRoom);
    this.isPending.add(EChatStore.updateRoom)
    try {
      const res = await this.chatService.updateRoom({ roomId, name, type });
      runInAction(() => {
        const index = this.rooms.findIndex(el => el?.id === roomId)
        if (index !== -1) this.rooms[index] = res.data
        if (this.room?.id === roomId) this.room = res.data
      });
    } catch (e) {
      if (e instanceof AxiosError) {
        toast.error(e.response?.data.detail)
      }
      this.isError.add(EChatStore.updateRoom);
    } finally {
      this.isLoading.delete(EChatStore.updateRoom);
      this.isPending.delete(EChatStore.updateRoom)
    }
  }

}

export type TChatStore = ChatStore