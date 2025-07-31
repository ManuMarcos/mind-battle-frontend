import type { ReactNode } from "react";

export const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col">
      
      <main className="flex-grow p-6 ">{children}</main>

      <footer className="text-center py-2 text-sm text-gray-700">
        Made with ❤️ by ManuMarcos
      </footer>
    </div>
  );
};
