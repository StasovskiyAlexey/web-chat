import type { components, paths } from "./paths";

export type TRoom = paths['/api/v1/rooms/get_room_by_id']['post']['responses']['200']['content']['application/json']['data']
export type TMessage = NonNullable<paths['/api/v1/messages/get_message_by_id']['post']['responses']['200']['content']['application/json']['data']>[number]

export type TRoomCreate = {
  user_id?: string;
  role: string;
  name: string;
  type: string;
}

export type TMessageCreate = components['schemas']['MessageCreate']
export type TMessageUpdate = components['schemas']['MessageUpdate']