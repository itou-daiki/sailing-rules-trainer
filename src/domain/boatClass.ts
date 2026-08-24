export type BoatClass = '420' | '470'

export interface BoatClassSpec {
  id: BoatClass
  name: string
  lengthMm: number
  beamMm: number
  summary: string
}

// World Sailing official class and building specifications:
// 420: https://media.sailing.org/sailing/wp-content/uploads/2022/07/02133245/420_BuildingSpec_2022-09Sep-01.pdf
// 470: https://media.sailing.org/sailing/wp-content/uploads/2023/01/19160058/470_005_080623_GA.pdf
export const BOAT_CLASS_SPECS: Record<BoatClass, BoatClassSpec> = {
  '420': {
    id: '420',
    name: 'International 420',
    lengthMm: 4200,
    beamMm: 1630,
    summary: '全長4.20 m × 全幅1.63 m／2人／メイン＋ジブ＋スピン／1トラピーズ',
  },
  '470': {
    id: '470',
    name: 'International 470',
    lengthMm: 4700,
    beamMm: 1700,
    summary: '全長4.70 m × 全幅1.70 m／2人／メイン＋ジブ＋スピン／1トラピーズ',
  },
}

export const BOAT_CLASS_STORAGE_KEY = 'sailing-rules-trainer:boat-class'

export function loadBoatClass(storage: Pick<Storage, 'getItem'>): BoatClass {
  return storage.getItem(BOAT_CLASS_STORAGE_KEY) === '470' ? '470' : '420'
}

export function saveBoatClass(storage: Pick<Storage, 'setItem'>, boatClass: BoatClass) {
  storage.setItem(BOAT_CLASS_STORAGE_KEY, boatClass)
}
