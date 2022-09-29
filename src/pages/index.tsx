//Import from react
import React, { FC, useEffect, useState } from "react";

//Import my urql client
import createUrqlClient from "../utils/createUrqlClient";

//Import from @chakra
import { Box, Button, Flex, Heading, Link, Stack, Text } from "@chakra-ui/react";

//Import from next-urql
import { withUrqlClient } from 'next-urql'; 
import { usePostsQuery } from "../generated/graphql";

//Import other components
import Layout from "../components/layout";

//Import from next
import NextLink from 'next/link'; 
import { UpdootSection } from "../components/UpdootSection";
import LoadingDots from "../components/LoadingDots";
import PostEditDeleteButtons from "../components/PostEditDeleteButtons";

interface IState {
  waitingDots: string,
}

const Index: FC<IState> = () => {

  const [variables, setVariables] = useState({ 
    limit: 10, 
    cursor: null as null | string
  })

  const [{data, error, fetching}, getPosts] = usePostsQuery({
    variables
  });

  useEffect(() => {
    getPosts({
      variables
    })
  }, [variables])

  if(!fetching && !data?.posts) {
    return (
      <div>
        {error?.message}
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
          <LoadingDots isLoading={fetching}/>
        :
        <Stack spacing={8} marginBottom={8}>
          {data?.posts.posts?.map((post) => {
            return (
              !post ? null
              :
              <Flex p={5} key={post.id} shadow='md' borderWidth='1px'>
                <UpdootSection post={post}/>
                <Box flex={1}>
                    <NextLink href='post/[id]' as={`/post/${post.id}`}>
                      <Link>
                        <Heading fontSize='2xl'>{post.title}</Heading>
                      </Link>
                    </NextLink>
                  By {' '}
                  <Text fontWeight={'bold'} fontSize={'large'} display={'inline'} mt={4}>{post.creator.username}</Text>
                  <Flex>
                    <Text flex={1} mt={4}>{post.textSnippet}</Text>
                    <Box>
                      <PostEditDeleteButtons id={post.id} creatorId={post.creator.id}/>
                    </Box>
                  </Flex>
                  </Box>
              </Flex>
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
                    cursor: data!.posts.posts[data!.posts.posts.length - 1].createdAt
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
