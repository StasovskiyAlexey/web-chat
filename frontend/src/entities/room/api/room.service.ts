import { type IHttpClient } from "@/shared/di/interfaces";
import { TTypes } from "@/shared/di/types";
import type { TResponse } from "@/app/types/response";
import { type TMessage, type TMessageCreate, type TMessageUpdate, type TRoom, type TRoomCreate } from '@/entities/room/model/types';
import { inject, injectable } from "inversify";
import type { TNotificationCreate } from "@/entities/notification/model/types";

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

  async inviteToRoom(code: string, inviterId: string, notificationData: {title: string, type: string}, inviteData: {roomId: string}) {
    const res = await this.http.post<TResponse<any>>(`rooms/invite_user_to_room`, {
      notification_data: {
        title: notificationData.title,
        type: notificationData.type
      },
      invite_data: {
        room_id: inviteData.roomId
      }}, 
      {params: {
        user_code: code, 
        inviter_id: inviterId
      }
    });
    return res.data
  }

  async acceptInvite(userId: string, notificationId: string, inviteId: string, status: string) {
    const res = await this.http.post<TResponse<null>>(`rooms/accept_room_invite`, {}, {
      params: {
        notification_id: notificationId,
        status: status,
        invite_id: inviteId, 
        user_id: userId, 
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

  async joinToRoomByCode(roomCode: string, inviterId: string, data: TNotificationCreate) {
    const res = await this.http.post<TResponse<null>>(`rooms/invite_from_user_to_room`, {title: data.title, type: data.type}, {
      params: {
        room_code: roomCode,
        inviter_id: inviterId
      }
    });
    return res.data
  }
}

export type TRoomService = RoomService