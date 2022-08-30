//Import from react
import { FC } from "react";

//Import from chakra
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { IconButton, Link } from "@chakra-ui/react";

//Import from next.js
import NextLink from "next/link";

//Import from graphql
import { useDeletePostMutation, useMeQuery } from "../generated/graphql";
import { useRouter } from "next/router";

interface PostEditDeleteButtonsProps {
    id: number;
    creatorId: number;
} 

const PostEditDeleteButtons: FC<PostEditDeleteButtonsProps> = ({id, creatorId}) => {
    
    const [_, deletePost] = useDeletePostMutation();
    const [{data: meData}] = useMeQuery();
    const router = useRouter(); 

    if(meData?.me?.id !== creatorId) {
        return null;
    }
    
    return (
        <>
            <IconButton
              onClick={async () => {
                if(window.confirm('Are you sure you want to delete this post ?')) {
                    await deletePost({
                        id
                    })
                    router.push('/');
                }
              }}
              aria-label='Delete Post'
              icon={<DeleteIcon name="delete"/>}
            />
            <Link>
              <NextLink href='/post/edit/[id]' as={`/post/edit/${id}`}>
                <IconButton
                  ml={5}
                  aria-label='Edit Post'
                  icon={<EditIcon name="delete"/>}
                />
              </NextLink>
            </Link>
        </>
    );
}

export default PostEditDeleteButtons;