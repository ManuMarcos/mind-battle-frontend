import type { ReactNode } from "react";


export const CenteredLayout = ({children} : {children : ReactNode}) => {

    return(
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-100 to-amber-300 p-4">
        {children}
    </div>
    )
};
