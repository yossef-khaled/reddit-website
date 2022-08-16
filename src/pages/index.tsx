//Import from react
import React, { FC } from "react";

//Import my urql client
import createUrqlClient from "../utils/createUrqlClient";

//Import from @chakra
import { Box, Button, Flex, Heading, Stack, Text } from "@chakra-ui/react";

//Import from next-urql
import { withUrqlClient } from 'next-urql'; 
import { usePostsQuery } from "../generated/graphql";
import { useEffect, useState } from "react";

//Import other components
import Layout from "../components/layout";

//Import from next
import NextLink from 'next/link'; 

interface IState {
  waitingDots: string,
}

const Index: FC<IState> = () => {

  const [variables, setVariables] = useState({ 
    limit: 10, 
    cursor: null as null | string
  })
  const [{data, fetching}] = usePostsQuery({
    variables
  });
  const [waitingDots, setWaitingDots] = useState('');

  // TODO : use setInterval instead
  const timerForLoadingDots = setTimeout(() => {
      waitingDots.length == 3 ? setWaitingDots('')
      :
      setWaitingDots(`${waitingDots}.`);
    }
  , 500) 

  console.log('Re-render')

  useEffect(() => {
    timerForLoadingDots;
  }, []);

  if(data?.posts.posts) {
    clearTimeout(timerForLoadingDots);
  }

  if(fetching && !data?.posts) {
    return (
      <div>
        Something wrong happend!
      </div>
    )
  }
  
  return (
    <Layout>
      <Flex>
        <Heading>
          Reddit Clone
        </Heading>
        <NextLink href={'/create-post'}>
          <Button backgroundColor={'wheat'} ml={'auto'} mb={5}>
            Create Post
          </Button>
        </NextLink>
      </Flex>
      <div>
        {fetching && !data?.posts.posts ? 
          <div>Loading{waitingDots}</div>
        :
        <Stack spacing={8} marginBottom={8}>
          {data?.posts.posts?.map((post) => {
            return (
              <Box p={5} key={post.id} shadow='md' borderWidth='1px'>
                <Heading fontSize='xl'>{post.title}</Heading>
                <Text mt={4}>{post.textSnippet}</Text>
              </Box>
            )
          })}
        </Stack>  
        }
        {data ? 
          <Flex>
            <Button
            disabled={!data.posts.hasMore}
              onClick={() => {
                  setVariables({
                    limit: 10,
                    cursor: data.posts.posts[data.posts.posts.length - 1].createdAt
                  })
              }}  
              m='auto' 
              mt={2} 
              mb={10} 
              isLoading={fetching}
            >
              Load more
            </Button>
          </Flex>
          :
          <></>
        }
      </div>
    </Layout>
  )
}

// ssr: true only for pages that need to be rendered in the server, but I still need to wrap all the pages with ` withUrqlClient() `
export default  withUrqlClient(createUrqlClient, {ssr: true})(Index);
