//Import from react
import React, { ReactNode } from "react";

//Import from @chakra-ui/react 
import { Box } from "@chakra-ui/react";

interface WrapperProps {
    children: ReactNode;
}

const Wrapper: React.FC<WrapperProps> = ({ children }) => {
    return (
        <Box maxW={"1000px"} w="70%" mx={'auto'} mt={20}>
            {children}
        </Box>
    )
}

export default Wrapper;