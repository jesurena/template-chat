import Chat from "./chat/page";
import Sidebar from "@/components/Sidebar";

export default function Home() {
  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <Sidebar />
      <main className="flex flex-col flex-1 min-w-0 overflow-hidden relative">
        <Chat />
      </main>
    </div>
  );
}
