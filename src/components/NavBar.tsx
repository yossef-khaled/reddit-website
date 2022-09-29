//Import from @chakra-ui/react 
import { Box, Button, Flex, Heading, Link } from "@chakra-ui/react";

//Import from next
import NextLink from 'next/link'; 
import { useEffect, useState } from "react";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import SearchBar from "./Searchbar";

const NavBar = ({ }) => {

    const [isServer, setIsServer] = useState(true);

    useEffect(() => {
        setIsServer(false);
    }, [])

    const [ {data, fetching }] = useMeQuery({
        // The following piece of code throws an error when isServer depends on typeof window 
        // as it will deffer between the ssr value and the browser value (I guess...)
        // See : https://nextjs.org/docs/messages/react-hydration-error
        
        pause: isServer, 
    });
    const [logoutMutationResult, doLogout] = useLogoutMutation();

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
                    onClick={ async () => {
                        await doLogout();
                        location.reload();
                    
                    }}
                    isLoading={logoutMutationResult.fetching}
                >
                    Logout
                </Button>
            </Flex>
        )
    }

    return (
        <Flex zIndex={1} position={'sticky'} top={0} bg={'tomato'} p={'5'} align="center">
            <Box>
                <NextLink href={'/'}>
                    <Link>
                        <Heading>
                            Reddit Clone
                        </Heading>
                    </Link>
                </NextLink>
            </Box>
                <SearchBar/>
            <Box ml={'auto'} mr={'2'}>
                {navbarBody}
            </Box>
        </Flex>
    )
}

export default NavBar;