import { type IHttpClient } from "@/shared/di/interfaces";
import { TTypes } from "@/shared/di/types";
import type { TResponse } from "@/app/types/response";
import { type TMessage, type TMessageCreate, type TMessageUpdate, type TRoom, type TRoomCreate } from '@/entities/room/model/types';
import { inject, injectable } from "inversify";

@injectable()
export class RoomService {
  constructor(@inject(TTypes.HttpClient) private http: IHttpClient) {}

  async getRooms() {
    const res = await this.http.get<TResponse<TRoom[]>>('rooms/get_rooms');
    return res.data
  }

  async getRoom(roomId: string) {
    const res = await this.http.post<TResponse<TRoom>>('rooms/get_room_by_id', {}, {params: {room_id: roomId}});
    return res.data
  }

  async createRoom(data: TRoomCreate) {
    const res = await this.http.post<TResponse<TRoom>>('rooms/create_room', {
      name: data.name,
      type: data.type
    }, 
    {params: {user_id: data.userId, role: data.role}});
    return res.data
  }

  async updateRoom(data: {name: string, type: string, roomId: string}) {
    const res = await this.http.post<TResponse<TRoom>>(`rooms/create_room/${data.roomId}`, {
      name: data.name,
      type: data.type
    });
    return res.data
  }

  async createMessage(data: TMessageCreate) {
    const res = await this.http.post<TResponse<TMessage>>(`messages/add_message`, {
      content: data.content,
      room_id: data.room_id,
      user_id: data.user_id,
      member_id: data.member_id
    });
    return res.data
  }

  async updateMessage(messageId: string, data: TMessageUpdate) {
    const res = await this.http.post<TResponse<TRoom>>(`messages/update_message`, {message_id: messageId}, {
      params: {
        content: data.content
      }
    });
    return res.data
  }

  async inviteToRoom(userCode: string, roomCode: string, title: string) {
    const res = await this.http.post<TResponse<any>>(`invitations/invite_to_room_from_user`, {}, {
      params: {
        user_code: userCode,
        room_code: roomCode,
        title
      }
    });
    return res.data
  }

  async inviteFromRoom(userCode: string, roomCode: string, title: string) {
    const res = await this.http.post<TResponse<null>>(`invitations/invite_from_room_to_user`, {}, {
      params: {
        user_code: userCode,
        room_code: roomCode,
        title
      }
    });
    return res.data
  }
 
  async deleteRoom(roomId: string) {
    const res = await this.http.post<TResponse<null>>(`rooms/delete_room`, {}, {
      params: {
        room_id: roomId
      }
    });
    return res.data
  }

  async deleteMemberFromRoom(roomId: string, userId: string, memberId: string) {
    const res = await this.http.post<TResponse<null>>(`rooms/delete_member_from_room`, {}, {
      params: {
        room_id: roomId,
        user_id: userId,
        member_id: memberId
      }
    });
    return res.data
  }
}

export type TRoomService = RoomService