//Import from react
import { useEffect, useState } from "react";

//Import from chakra
import { 
    Button, 
    Modal, 
    ModalBody, 
    ModalCloseButton, 
    ModalContent, 
    ModalHeader, 
    ModalOverlay, 
    useDisclosure,
    Input,
    Box,
    Flex,
    Heading,
    Link,
    Text,
    Stack,
    Center
} from "@chakra-ui/react";
import { SearchIcon } from '@chakra-ui/icons';

//Import from next js
import NextLink from 'next/link'; 

//Import aito generated types 
import { useSearchPostsQuery } from "../generated/graphql";

const SearchBar = ({  }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [searchString, setSearchString] = useState('');
    const [{data}, search] = useSearchPostsQuery({
        variables: {searchString}  
    })

    useEffect( () => {
        search({searchString});
    }, [searchString])

    return (
        <>
            <Button 
                ml={'auto'}
                borderBottom={'grey'}
                borderBottomRadius={0}
                borderBottomStyle={'solid'}
                variant={"unstyled"}
                onClick={onOpen}
            >
                <SearchIcon/>
                <Input
                    placeholder="Search posts titles or texts"
                    fontStyle={'italic'}
                    variant={"unstyled"}
                    ml={2}
                />
            </Button>
            <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>
                    <SearchIcon/>
                    {' '} Search
                    <Input
                        onChange={(e) => setSearchString(e.target.value)}
                    />
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    {data?.searchPosts && data?.searchPosts.length > 0  ? data?.searchPosts.map((p) => {
                        return (
                            <Stack> 
                                <Flex p={5} key={p.id} shadow='md' borderWidth='1px'>
                                <Box flex={1}>
                                    <NextLink href='/post/[id]' as={`/post/${p.id}`}>
                                      <Link>
                                        <Heading fontSize='2xl'>{p.title}</Heading>
                                      </Link>
                                    </NextLink>
                                  By {' '}
                                  <Text fontWeight={'bold'} fontSize={'large'} display={'inline'} mt={4}>{p.creator.username}</Text>
                                  <Flex>
                                    <Text flex={1} mt={4}>{p.textSnippet}</Text>
                                  </Flex>
                                </Box>
                                </Flex>
                            </Stack>
                        )
                    })  
                    
                    :
                    <Center fontSize={'3xl'}>
                        No posts
                    </Center>  
                    }
                </ModalBody>
              </ModalContent>
            </Modal>
        </>
    );
}

export default SearchBar;