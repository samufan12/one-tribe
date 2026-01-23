import GrailedLayout from "@/components/GrailedLayout";
import { ChatInterface } from "@/components/ChatInterface";

const MessagesPage = () => {
  return (
    <GrailedLayout>
      <div className="max-w-[1400px] mx-auto px-4 py-6">
        <ChatInterface />
      </div>
    </GrailedLayout>
  );
};

export default MessagesPage;
