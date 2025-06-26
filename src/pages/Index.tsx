
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import Header from "@/components/Header";
import { MainContent } from "@/components/MainContent";

type ContentView = 'home' | 'marketplace' | 'community' | 'messages' | 'profile';

const Index = () => {
  const [activeView, setActiveView] = useState<ContentView>('home');

  // Listen to sidebar navigation (you'll need to pass this down or use context)
  const handleSidebarNavigation = (view: ContentView) => {
    setActiveView(view);
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <MainContent activeView={activeView} />
        </main>
      </div>
    </div>
  );
};

export default Index;
