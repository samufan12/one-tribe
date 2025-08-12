
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import Header from "@/components/Header";
import { MainContent } from "@/components/MainContent";

type ContentView = 'home' | 'marketplace' | 'community' | 'messages' | 'assistant' | 'profile';

const Index = () => {
  const [activeView, setActiveView] = useState<ContentView>('home');

  const handleSidebarNavigation = (view: ContentView) => {
    setActiveView(view);
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar activeView={activeView} onNavigate={handleSidebarNavigation} />
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
