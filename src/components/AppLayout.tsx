
export const AppLayout = ( {children} : {children : React.ReactNode}) => {
    return(
        <div className="min-h-screen bg-gradient-to-br from-amber-100 to-amber-300">
            {children}
        </div>
    )
}