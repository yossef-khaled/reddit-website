import { FC, ReactNode } from "react";
import NavBar from "./NavBar";
import Wrapper from "./Wrapper";

interface LayoutProps {
    children: ReactNode; 
}

const Layout: FC<LayoutProps> = ({ children }) => {
    return (
        <>
            <NavBar/>
            <Wrapper>
                { children }
            </Wrapper>
        </>
    );
}

export default Layout;