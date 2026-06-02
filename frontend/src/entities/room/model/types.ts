import type { components, paths } from "@/app/types/paths";

export type TRoom = paths['/api/v1/rooms/get_room_by_id']['post']['responses']['200']['content']['application/json']['data']
export type TMessage = components['schemas']['MessageResponse']
export type TMember = components['schemas']['MemberResponse']

export type TRoomCreate = {
  userId?: string;
  role: string;
  name: string;
  type: string;
}

export type TRoomUpdate = {
  roomId: string;
  name: string;
  type: string;
}

export type TRoomInvite = {
  roomCode: string
  userCode: string
  title: string
}

export type TMessageCreate = components['schemas']['MessageCreate']
export type TMessageUpdate = components['schemas']['MessageUpdate']