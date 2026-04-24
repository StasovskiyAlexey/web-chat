import type { paths } from "./paths";

export type TRoom = paths['/api/v1/rooms/get_room_by_id']['post']['responses']['200']['content']['application/json']['data']

export type TRoomCreate = {
  user_id?: string;
  role: string;
  name: string;
  type: string;
}