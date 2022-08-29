//Import from urql
import { Flex, Heading, Text, Box } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";

//Improt from next
import { useRouter } from "next/router";

//Import other components
import Layout from "../../components/layout";
import LoadingDots from "../../components/LoadingDots";
import { UpdootSection } from "../../components/UpdootSection";

//Import auto generated stuff
import { usePostQuery } from "../../generated/graphql";

//Import utils
import createUrqlClient from "../../utils/createUrqlClient";

export const Post = ({}) => {
    const router = useRouter();
    const idAsInt = typeof router.query.id === 'string' ? parseInt(router.query.id) : -1;
    const [{data, error, fetching}] = usePostQuery({
        pause: idAsInt === -1,
        variables: {
            id: idAsInt
        }
    });
    
    if(error) {
        console.log(error.message);
    }

    return (
        <Layout>
        {
            fetching ?
            <LoadingDots isLoading={fetching}/>
            :
            <Flex p={5} key={data?.post?.id} shadow='md' borderWidth='1px'>
                <UpdootSection post={data?.post!}/>
                <Box>
                  <Heading fontSize='2xl'>{data?.post?.title}</Heading>
                  By {' '}
                  <Text fontWeight={'bold'} fontSize={'large'} display={'inline'} mt={4}>{data?.post?.creator.username}</Text>
                  <Text mt={4}>{data?.post?.text}</Text>
                </Box>
            </Flex>
        }
        </Layout>
    );
}

export default withUrqlClient(createUrqlClient, {ssr: true})(Post);