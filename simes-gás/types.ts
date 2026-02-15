
export enum CylinderType {
  P5 = 'P5',
  P13 = 'P13',
  P20 = 'P20',
  P45 = 'P45',
  P90 = 'P90'
}

export interface Cylinder {
  name: CylinderType;
  maxWeight: number;
}

export const CYLINDERS: Record<CylinderType, Cylinder> = {
  [CylinderType.P5]: { name: CylinderType.P5, maxWeight: 5.0 },
  [CylinderType.P13]: { name: CylinderType.P13, maxWeight: 13.0 },
  [CylinderType.P20]: { name: CylinderType.P20, maxWeight: 20.0 },
  [CylinderType.P45]: { name: CylinderType.P45, maxWeight: 45.0 },
  [CylinderType.P90]: { name: CylinderType.P90, maxWeight: 90.0 },
};

export interface DeviceState {
  percentage: number;
  currentWeight: number;
  gasWeight: number;
  tara: number;
  cylinderType: CylinderType;
  leakInternal: boolean;
  leakExternal: boolean;
  isMuted: boolean;
  relayActive: boolean;
  mq2InternalValue: number;
  mq2ExternalValue: number;
  lastUpdate: Date;
}

export interface HistoryPoint {
  time: string;
  weight: number;
}

export interface EventLog {
  id: string;
  time: string;
  message: string;
  type: 'alert' | 'leak' | 'refill';
}
