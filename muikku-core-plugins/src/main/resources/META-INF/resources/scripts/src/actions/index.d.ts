export interface ActionType<PayloadType> {
  type: string,
  payload: PayloadType
}