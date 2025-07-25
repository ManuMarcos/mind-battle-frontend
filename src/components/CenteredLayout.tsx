import { useState, type ReactNode } from "react";
import { UserDropdown } from "./UserDropdown";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "./ui/button";
import { AuthModal } from "./AuthModal";

export const CenteredLayout = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="min-h-screen  bg-gradient-to-br from-amber-100 to-amber-300">
      <div className="flex flex-row-reverse">
        {isAuthenticated ? (
          <UserDropdown />
        ) : (
          <div>
            <Button className="mr-3 mt-2" onClick={() => setOpenModal(true)}>
              Iniciar Sesión
            </Button>
            <AuthModal isOpen={openModal} onOpenChange={setOpenModal} />
          </div>
        )}
      </div>

      <div className="flex items-center justify-center p-4">{children}</div>
    </div>
  );
};
