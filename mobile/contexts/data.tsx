import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Checklist, ChecklistTemplate } from '../types';
import * as SplashScreen from 'expo-splash-screen';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// Set the animation options. This is optional.
SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

// Keys in AsyncStorage
const CHECKLISTS_KEY = '@myapp:checklists';
const TEMPLATES_KEY = '@myapp:templates';

// --- Context Value Shape ---
export interface DataContextType {
  isReady: boolean;
  checklists: Checklist[];
  templates: ChecklistTemplate[];
  addChecklist: (c: Checklist) => Promise<void>;
  updateChecklist: (c: Checklist) => Promise<void>;
  removeChecklist: (id: string) => Promise<void>;
  addTemplate: (t: ChecklistTemplate) => Promise<void>;
  updateTemplate: (t: ChecklistTemplate) => Promise<void>;
  removeTemplate: (id: string) => Promise<void>;
  routeIndex: number;
  setRouteIndex: (index: number) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// --- Provider ---
export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [routeIndex, setRouteIndex] = React.useState(0);

  const [isReady, setIsReady] = useState(false);
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [templates, setTemplates] = useState<ChecklistTemplate[]>([]);

  // Persist on changes
  useEffect(() => {
    // To remove checklists from AsyncStorage, uncomment the line below
    // and run the app once. After that, comment it again to avoid removing
    // checklists every time the app loads.
    // AsyncStorage.removeItem('checklists');

    if (isReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      SplashScreen.hide();
    }
  }, [checklists, isReady]);

  // Load data on mount
  useEffect(() => {
    async function loadData() {
      try {
        const [savedLists, savedTemplates] = await Promise.all([
          AsyncStorage.getItem(CHECKLISTS_KEY),
          AsyncStorage.getItem(TEMPLATES_KEY),
        ]);
        if (savedLists) setChecklists(JSON.parse(savedLists));
        if (savedTemplates) setTemplates(JSON.parse(savedTemplates));
      } catch (err) {
        console.error('Failed to load data', err);
      } finally {
        setIsReady(true);
      }
    }

    loadData();
  }, []);

  // Helper to persist
  async function persist<T>(key: string, data: T) {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (err) {
      console.error('Persist error', err);
    }
  }

  // Uncomment the line below to use mock data for development
  // useEffect(() => {
  //   persist(CHECKLISTS_KEY, MOCK_CHECKLISTS);
  //   persist(TEMPLATES_KEY, MOCK_CHECKLIST_TEMPLATES);
  // }, []);

  // CRUD for Checklists
  const addChecklist = async (c: Checklist) => {
    const updated = [c, ...checklists];
    setChecklists(updated);
    await persist(CHECKLISTS_KEY, updated);
  };

  const updateChecklist = async (c: Checklist) => {
    const updated = checklists.map((item) => (item.id === c.id ? c : item));
    setChecklists(updated);
    await persist(CHECKLISTS_KEY, updated);
  };

  const removeChecklist = async (id: string) => {
    const updated = checklists.filter((c) => c.id !== id);
    setChecklists(updated);
    await persist(CHECKLISTS_KEY, updated);
  };

  // CRUD for Templates
  const addTemplate = async (t: ChecklistTemplate) => {
    const updated = [t, ...templates];
    setTemplates(updated);
    await persist(TEMPLATES_KEY, updated);
  };

  const updateTemplate = async (t: ChecklistTemplate) => {
    const updated = templates.map((item) => (item.id === t.id ? t : item));
    setTemplates(updated);
    await persist(TEMPLATES_KEY, updated);
  };

  const removeTemplate = async (id: string) => {
    const updated = templates.filter((t) => t.id !== id);
    setTemplates(updated);
    await persist(TEMPLATES_KEY, updated);
  };

  return (
    <DataContext.Provider
      value={{
        isReady,
        checklists,
        templates,
        addChecklist,
        updateChecklist,
        removeChecklist,
        addTemplate,
        updateTemplate,
        removeTemplate,
        routeIndex,
        setRouteIndex,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

// --- Hook ---
export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
