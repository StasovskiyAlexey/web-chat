import type { IHttpClient } from "@/shared/di/interfaces";
import { TTypes } from "@/shared/di/types";
import type { TInvite, TNotification } from "@/entities/notification/model/types";
import type { TResponse } from "@/app/types/response";
import { inject, injectable } from "inversify";

@injectable()
export class NotificationService {
  constructor(@inject(TTypes.HttpClient) private http: IHttpClient) {}

  async getNotifications(userId: string) {
    const res = await this.http.post<TResponse<TNotification[]>>(`notifications/get_notifications?user_id=${userId}`)
    return res.data
  }

  async getInvitations(userId: string) {
    const res = await this.http.post<TResponse<TInvite[]>>(`invitations/get_user_invitations?user_id=${userId}`)
    return res.data
  }

  async acceptInvite(userId: string, notificationId: string, inviteId: string, status: string) {
    const res = await this.http.post<TResponse<null>>(`invitations/accept_room_invite`, {}, {
      params: {
        notification_id: notificationId,
        status: status,
        invite_id: inviteId, 
        user_id: userId, 
      }
    });
    return res.data
  }
}

export type TNotificationService = NotificationService