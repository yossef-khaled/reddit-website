//Import from react
import { FC } from "react";

//Import from @chakra
import { Button, Box } from "@chakra-ui/react";

//Improt from formik
import { Formik, Form } from "formik";

//Import other components
import InputField from "../components/InputField";
import Layout from "../components/layout";

//Import from next 
import { useRouter } from 'next/router';
import { withUrqlClient } from 'next-urql';
import createUrqlClient from '../utils/createUrqlClient';

//Import auto generated mutation hook
import { useCreatePostMutation } from "../generated/graphql";

//Import utils
import { toErrorMap } from "../utils/toErrorMap";
import { userIsAuth } from "../utils/useIsAuth";

const CreatePost: FC<{}> = ({}) => {
    
    const [, createPost] = useCreatePostMutation();
    const router = useRouter();

    userIsAuth();

    return (
        <Layout>
            <Formik 
                initialValues={{title: '', text: ''}}
                onSubmit={async (values, { setErrors }) => {
                    const response = await createPost({ options : values });
                    if(response.data?.createPost.errors) {
                        setErrors(toErrorMap(response.data?.createPost.errors));
                        return;
                    }
                    router.replace('/');
                }}    
            >
                {({isSubmitting}) => (
                    <Form>
                        <InputField
                            name='title'
                            placeholder='Post title'
                            label='Title'
                        />
                        <Box mt={10}>
                            <InputField
                                name='text'
                                placeholder='Post text'
                                label='Text'
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
                            Post
                        </Button>
                    </Form>
                )}
            </Formik>
        </Layout>
    )
}

export default withUrqlClient(createUrqlClient)(CreatePost);