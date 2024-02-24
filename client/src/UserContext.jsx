import { createContext } from "react";

export const UserContext = createContext({});

export function UserContext({ children }) {
    return (
        { children }
    );
}