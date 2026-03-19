import Sidebar from "@/components/Sidebars/Sidebar";

export default function ChatLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col lg:flex-row h-screen overflow-hidden bg-background transition-colors duration-300">
            <Sidebar />
            <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative">
                <main className="flex-1 overflow-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
}
