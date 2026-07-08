import AsyncStorage from '@react-native-async-storage/async-storage';

const VISITED_MATERI_KEY = '@krama_quest_visited_materi';

export const ProgressService = {
  // Get the list of visited material IDs
  getVisitedMateri: async (): Promise<number[]> => {
    try {
      const data = await AsyncStorage.getItem(VISITED_MATERI_KEY);
      if (data !== null) {
        return JSON.parse(data);
      }
      return [];
    } catch (e) {
      console.error('Failed to load visited materi', e);
      return [];
    }
  },

  // Add a material ID to the visited list
  markMateriVisited: async (materiId: number): Promise<void> => {
    try {
      const currentVisited = await ProgressService.getVisitedMateri();
      if (!currentVisited.includes(materiId)) {
        const newVisited = [...currentVisited, materiId];
        await AsyncStorage.setItem(VISITED_MATERI_KEY, JSON.stringify(newVisited));
      }
    } catch (e) {
      console.error('Failed to save visited materi', e);
    }
  },

  // Clear the visited materials (optional, e.g., for testing)
  clearVisitedMateri: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(VISITED_MATERI_KEY);
    } catch (e) {
      console.error('Failed to clear visited materi', e);
    }
  }
};
