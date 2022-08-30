//Import from chakra
import { Button, Box } from "@chakra-ui/react";

//Import formik
import { Formik, Form } from "formik";

//Import urql stuff
import { withUrqlClient } from "next-urql";

//Improt next router
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

//Import other components
import InputField from "../../../components/InputField";
import Layout from "../../../components/layout";
import LoadingDots from "../../../components/LoadingDots";

//Import from graphql
import { usePostQuery, useUpdatePostMutation } from "../../../generated/graphql";

//Import utils
import createUrqlClient from "../../../utils/createUrqlClient";
import { userIsAuth } from "../../../utils/useIsAuth";

export const EditPost = ({}) => {

    const router = useRouter();
    
    const idAsInt = typeof router.query.id === 'string' ? parseInt(router.query.id) : -1;
    const [{data, error, fetching}] = usePostQuery({
        pause: idAsInt === -1,
        variables: {
            id: idAsInt
        }
    });

    const [_, editPost] = useUpdatePostMutation();
    const [title, setTitle] = useState<string>();
    const [text, setText] = useState<string>();

    useEffect(() => {
        setTitle(data?.post.title);
        setText(data?.post.text);
    }, [fetching])

    userIsAuth();

    return (
        <Layout>
            {
                fetching && ! data?.post ?
                <LoadingDots isLoading={fetching}/>
                :
                <Formik 
                initialValues={{title: '', text: ''}}
                onSubmit={async (values, { setErrors }) => {
                    const response = await editPost({
                        id: idAsInt,
                        text: text,
                        title: title
                    });
                    router.back();
                }}    
            >
                {({values, handleChange, isSubmitting}) => (
                    <Form>
                        <InputField
                            name='title'
                            placeholder='Post title'
                            label='Title'
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <Box mt={10}>
                            <InputField
                                name='text'
                                placeholder='Post text'
                                label='Text'
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                textarea={true}
                            />
                        </Box>
                        <Button 
                            mt={10} 
                            mx={'auto'} 
                            backgroundColor={'turquoise'} 
                            color={'white'} 
                            type='submit'
                            isLoading={isSubmitting}
                        >
                            Edit
                        </Button>
                    </Form>
                )}
            </Formik>
            }
        </Layout>
    );
}

export default withUrqlClient(createUrqlClient, {ssr: true})(EditPost);