import type { ReactNode } from "react";

export const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-amber-100 to-amber-300">
      <main className="flex-grow p-6 ">
        {children}
      </main>

      <footer className="text-center py-2 text-sm text-gray-700">
        Made with Love by ManuMarcoss
      </footer>
    </div>
  );
};
