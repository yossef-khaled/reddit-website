//Import from @chakra-ui/react 
import { Box, Button, Flex, Link } from "@chakra-ui/react";

//Import from next
import NextLink from 'next/link'; 
import { useEffect } from "react";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";

//Import utils
import { isServer } from "../utils/isServer";
 
interface NavBarProps {
    
}

const NavBar: React.FC<NavBarProps> = ({ }) => {

    const [ {data, fetching, error}, whoAmI] = useMeQuery({
        // The following piece of code throws an error as isServer will deffer between the ssr value and the browser value
        // See : https://nextjs.org/docs/messages/react-hydration-error
        
        // pause: isServer(), 
    });
    const [logoutMutationResult, doLogout] = useLogoutMutation();

    console.log('data', data);

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
                <Button 
                    variant='link' 
                    onClick={() => {doLogout()}}
                    isLoading={logoutMutationResult.fetching}
                >
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