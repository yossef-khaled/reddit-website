//Import react
import React, { FC } from 'react'; 

//Import from @chakra-ui/react
import { Flex, IconButton, Text } from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";

//Import graphql hooks generated with graphql code generator
import { PostQuery, PostsQuery, useVoteMutation } from '../generated/graphql';

interface UpdootSectionProps {
    post: PostsQuery['posts']['posts'][0] | PostQuery['post'];
}

export const UpdootSection: FC<UpdootSectionProps> = ({post}) => {

    const [voteMutationReturn, vote] = useVoteMutation();

    return (
        <Flex direction={'column'} justify={'center'} alignItems={'center'} mr={4}>
        <IconButton
          onClick={() => {
            if(post.voteStatus == 1) {
              return;
            }
            vote({
              value: 1,
              postId: post.id
            })
          }}
          disabled={post.voteStatus === 1}
          backgroundColor={post.voteStatus === 1 ? 'green' : ''}
          isLoading={voteMutationReturn.fetching}
          aria-label='updoot post'
          value={1}
          icon={<ChevronUpIcon name="chevron-up"/>}
        />
        <Text color={post.points > 0 ? 'green' : post.points < 0 ? 'red' : ''}>
          {post.points}
        </Text>
        <IconButton
          onClick={() => {
            if(post.voteStatus == -1) {
              return;
            }
            vote({
              value: -1,
              postId: post.id
            })
          }}
          disabled={post.voteStatus === -1}
          backgroundColor={post.voteStatus === -1 ? 'red' : ''}
          isLoading={voteMutationReturn.fetching}
          aria-label='downdoot post'
          value={-1}
          icon={<ChevronDownIcon name="ChevronUpIcon"/>}
        />
      </Flex>
    );
}