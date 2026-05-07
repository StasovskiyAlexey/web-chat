import type { IHttpClient } from "@/di/interfaces";
import { TTypes } from "@/di/types";
import type { TInvite, TNotification, TNotificationCreate, TNotificationUpdate } from "@/types/chat";
import type { TResponse } from "@/types/response";
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

  async addNotification(userId: string, data: TNotificationCreate) {
    const res = await this.http.post<TResponse<TNotification[]>>(`notifications/add_notification`, {}, {
      params: {
        user_id: userId,
        title: data.title,
        type: data.type
      }
    })
    return res.data
  }

  async updateNotification(userId: string, notificationId: string, notificationData: TNotificationUpdate) {
    const res = await this.http.post<TResponse<TNotification>>(`notifications/update_notification`, {}, {
      params: {
        user_id: userId,
        notification_id: notificationId,
        notification_data: notificationData
      }
    });
    return res.data
  }

}

export type TNotificationService = NotificationService