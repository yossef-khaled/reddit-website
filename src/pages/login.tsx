//Import react
import React, { FC, useEffect } from 'react'; 

//Import from @chakra-ui/react
import { FormControl, FormLabel, Input, FormErrorMessage, Box, Button } from '@chakra-ui/react';

//Import formik
import { Formik, Form } from 'formik';

//Import other components
import Wrapper from '../components/Wrapper'; 
import InputField from '../components/InputField';

//Import graphql hooks generated with graphql code generator
import { useLoginMutation, useRegisterMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';

//Import from next 
import { useRouter } from 'next/router';
import { withUrqlClient } from 'next-urql';
import createUrqlClient from '../utils/createUrqlClient';

interface loginProps {
    
}

const Login: FC<loginProps> = ({}) => {

    const router = useRouter();
    const [loginMutationResult, doLogin] = useLoginMutation();

    var {data, fetching, error} = loginMutationResult;

    useEffect(() => {
        console.log(error);
        console.log(data);
    }, [loginMutationResult])

    return (
        <Wrapper>
            <Formik 
                initialValues={{username: '', password: ''}}
                onSubmit={async (values, { setErrors }) => {
                    const responce = await doLogin({ options: values}); 
                    if(responce.data?.login.errors) {
                        setErrors(toErrorMap(responce.data.login.errors));
                    }
                    else if (responce.data?.login.user) {
                        router.push('/');
                    }
                }}    
            >
                {({values, handleChange, isSubmitting}) => (
                    <Form>
                        <InputField
                            name='username'
                            placeholder='Please, type in your username'
                            label='Username'
                        />
                        <Box mt={10}>
                            <InputField
                                name='password'
                                placeholder='Please, type in your password'
                                label='Password'
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
                            Login
                        </Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    );
}

export default withUrqlClient(createUrqlClient)(Login);