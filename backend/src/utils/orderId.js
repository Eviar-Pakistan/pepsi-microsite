import { v4 as uuidv4 } from 'uuid'

export function createOrderId() {
  return `pepsi-${uuidv4()}`
}
