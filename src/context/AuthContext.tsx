import api from "@/api/axios";
import axios from "axios";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

interface AuthProviderProps {
    children :  React.ReactNode
}

interface AuthContextType {
    token:  string | null;
    login: (newToken : string, user : string) => void;
    logout: () => void;
    isAuthenticated : boolean;
    user : string | null
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({children} : AuthProviderProps) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem("accessToken"));
    const [user, setUser] = useState<string | null>(localStorage.getItem('user'));


    const login = (newToken : string, user : string) => {
        setToken(newToken);
        setUser(user);
        //axios.defaults.headers.common.Authorization = `Bearer ${token}`;
        localStorage.setItem('accessToken', newToken);
        localStorage.setItem('user', user);
    }

    const logout = () => {
        setToken(null);
        //delete axios.defaults.headers.common.Authorization;
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
    }

    const isAuthenticated =  !! token;

   const contextValue = useMemo( () => ({
    token,
    login,
    logout,
    isAuthenticated,
    user
   }), [token])

   return(
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
   )
}
