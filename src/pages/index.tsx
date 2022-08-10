//Import from react
import React, { FC } from "react";

//Import my urql client
import createUrqlClient from "../utils/createUrqlClient";

//Import from @chakra
import { Box, Button, Heading, Stack, Text } from "@chakra-ui/react";

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

  const [{data}] = usePostsQuery({
    variables: {
      limit: 10
    }
  });
  const [waitingDots, setWaitingDots] = useState('');

  const timerForLoadingDots = setTimeout(() => {
      waitingDots.length == 3 ? setWaitingDots('')
      :
      setWaitingDots(`${waitingDots}.`);
    }
  , 500) 

  useEffect(() => {
    timerForLoadingDots;
  }, []);

  if(data?.posts) {
    clearTimeout(timerForLoadingDots);
  }
  
  return (
    <Layout>
      <NextLink href={'/create-post'}>
        <Button backgroundColor={'wheat'} mb={5}>
          Create Post
        </Button>
      </NextLink>
      <div>
        {!data?.posts ? 
          <div>Loading{waitingDots}</div>
        :
        <Stack spacing={8} marginBottom={8}>
          {data.posts.map((post) => {
            return (
              <Box p={5} key={post.id} shadow='md' borderWidth='1px'>
                <Heading fontSize='xl'>{post.title}</Heading>
                <Text mt={4}>{post.text}</Text>
              </Box>
            )
          })}
        </Stack>  
        }
      </div>
    </Layout>
  )
}

// ssr: true only for pages that need to be rendered in the server, but I still need to wrap all the pages with ` withUrqlClient() `
export default  withUrqlClient(createUrqlClient, {ssr: true})(Index);
