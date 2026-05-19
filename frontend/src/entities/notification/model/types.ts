import type { paths } from "@/app/types/paths";

export type TNotification = NonNullable<paths['/api/v1/notifications/get_notifications']['post']['responses']['200']['content']['application/json']['data']>[number]
