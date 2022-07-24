//Import from @chakra-ui/react 
import { Box, Flex, Link } from "@chakra-ui/react";

//Import from next
import NextLink from 'next/link'; 

interface NavBarProps {
    
}

const NavBar: React.FC<NavBarProps> = ({ }) => {
    return (
        <Flex bg={'tomato'} p={'5'}>
            <Box ml={'auto'}>
                <NextLink href={'/login'}>
                    <Link m={2}>
                        Login
                    </Link>
                </NextLink>
                <NextLink href={'/register'}>
                    <Link m={2}>
                        Register
                    </Link>
                </NextLink>
            </Box>
        </Flex>
    )
}

export default NavBar;