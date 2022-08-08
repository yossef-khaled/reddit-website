//Import from @chakra-ui/react 
import { Box, Button, Flex, Link } from "@chakra-ui/react";

//Import from next
import NextLink from 'next/link'; 
import { useEffect, useState } from "react";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";

const NavBar = ({ }) => {

    const [isServer, setIsServer] = useState(true);

    useEffect(() => {
        setIsServer(false);
    }, [])

    const [ {data, fetching, error}, whoAmI] = useMeQuery({
        // The following piece of code throws an error when isServer depends on typeof window 
        // as it will deffer between the ssr value and the browser value (I guess...)
        // See : https://nextjs.org/docs/messages/react-hydration-error
        
        pause: isServer, 
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
        <Flex zIndex={1} position={'sticky'} top={0} bg={'tomato'} p={'5'}>
            <Box ml={'auto'}>
                {navbarBody}
            </Box>
        </Flex>
    )
}

export default NavBar;