import type { components, paths } from "@/app/types/paths";

export type TNotification = NonNullable<paths['/api/v1/notifications/get_notifications']['post']['responses']['200']['content']['application/json']['data']>[number]
export type TInvite = NonNullable<paths['/api/v1/invitations/get_user_invitations']['post']['responses']['200']['content']['application/json']['data']>

export type TNotificationCreate = components['schemas']['NotificationCreate']
export type TNotificationUpdate = components['schemas']['NotificationUpdate']