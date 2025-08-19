
import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import Header from "@/components/Header";
import { MainContent } from "@/components/MainContent";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

type ContentView = 'home' | 'marketplace' | 'community' | 'messages' | 'assistant' | 'profile' | 'become-seller' | 'seller-tools';

const Index = () => {
  const [activeView, setActiveView] = useState<ContentView>('home');
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const handleSidebarNavigation = (view: ContentView) => {
    setActiveView(view);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

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
