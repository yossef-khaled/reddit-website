//Import react
import React, { FC, useEffect } from 'react'; 

//Import from @chakra-ui/react
import { Box, Button } from '@chakra-ui/react';

//Import formik
import { Formik, Form } from 'formik';

//Import other components
import Wrapper from '../components/Wrapper'; 
import InputField from '../components/InputField';

//Import graphql hooks generated with graphql code generator
import { useRegisterMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';

//Import from next 
import { useRouter } from 'next/router';
import { withUrqlClient } from 'next-urql';
import createUrqlClient from '../utils/createUrqlClient';

interface registerProps {
    
}

const Register: FC<registerProps> = ({}) => {

    const router = useRouter();
    const [registerMutationResult, doRegister] = useRegisterMutation();

    return (
        <Wrapper>
            <Formik 
                initialValues={{email: '', username: '', password: ''}}
                onSubmit={async (values, { setErrors }) => {
                    const responce = await doRegister({options : values}); 
                    if(responce.data?.register.errors) {
                        setErrors(toErrorMap(responce.data.register.errors));
                    }
                    else if (responce.data?.register.user) {
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
                                name='email'
                                placeholder='Please, type in your email'
                                label='E-mail'
                            />
                        </Box>
                        <Box mt={10}>
                            <InputField
                                name='password'
                                placeholder='Please, type in your password'
                                label='Password'
                                type='password'
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
                            Register
                        </Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    );
}

export default withUrqlClient(createUrqlClient)(Register);