export interface Unit {
  unitId: number;
  unitName: string;
}

export interface CreateUnitRequest {
  unitName: string;
}

export interface UpdateUnitRequest {
  unitName: string;
}