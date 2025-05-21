import { create } from 'zustand';

type Tab = 'all' | 'my';

interface ForumTabStore {
    activeTab: Tab;
    setGlobalActiveTab: (tab: Tab) => void;
}

export const useForumTabStore = create<ForumTabStore>((set) => ({
    activeTab: 'all',
    setGlobalActiveTab: (tab: Tab) => set({activeTab: tab}),
}));