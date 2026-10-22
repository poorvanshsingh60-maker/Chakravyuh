export type RoomType = 'PHYSICAL' | 'VIRTUAL';

export interface Room {
  id: string;
  name: string;
  type: RoomType;
  capacity: number;
  location: string;
  meetingUrl?: string;
  isActive: boolean;
  utilizationRate?: number;
}
