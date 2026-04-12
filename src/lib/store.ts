import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Shot, Trip } from '@/types'

interface Store {
  trip: Trip | null
  shots: Shot[]
  shotCounter: number
  setTrip: (trip: Trip) => void
  addShot: (shot: Omit<Shot, 'id'>) => void
  removeShot: (id: number) => void
  clearAll: () => void
}

export const useStore = create<Store>()(
  persist(
    (set) => ({
      trip: null,
      shots: [],
      shotCounter: 0,

      setTrip: (trip) => set({ trip }),

      addShot: (shot) =>
        set((state) => ({
          shotCounter: state.shotCounter + 1,
          shots: [...state.shots, { ...shot, id: state.shotCounter + 1 }],
        })),

      removeShot: (id) =>
        set((state) => ({ shots: state.shots.filter((s) => s.id !== id) })),

      clearAll: () => set({ shots: [], shotCounter: 0, trip: null }),
    }),
    { name: 'prod-mgt-store' }
  )
)
