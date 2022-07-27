//Import from @chakra-ui/react 
import { Box, Button, Flex, Link } from "@chakra-ui/react";

//Import from next
import NextLink from 'next/link'; 
import { useEffect } from "react";
import { useMeQuery } from "../generated/graphql";

interface NavBarProps {
    
}

const NavBar: React.FC<NavBarProps> = ({ }) => {

    const [ {data, fetching, error}, whoAmI] = useMeQuery();

    var navbarBody = null;

    // Data is loading
    if(fetching) {
        
    // User is not logged in
    } else if (!data?.me) {

        navbarBody = (
            <>
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
            </>
        )
    } else if(data.me) {
        
        navbarBody = (
            <Flex>
                <Box mr={'2'}>
                    {data.me.username}
                </Box>
                <Button variant='link'>
                    Logout
                </Button>
            </Flex>
        )
    }

    return (
        <Flex bg={'tomato'} p={'5'}>
            <Box ml={'auto'}>
                {navbarBody}
            </Box>
        </Flex>
    )
}

export default NavBar;