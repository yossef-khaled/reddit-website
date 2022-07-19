//Import react
import React, { FC, useEffect } from 'react'; 

//Import from @chakra-ui/react
import { FormControl, FormLabel, Input, FormErrorMessage, Box, Button } from '@chakra-ui/react';

//Import formik
import { Formik, Form } from 'formik';

//Import other components
import Wrapper from '../components/Wrapper'; 
import InputField from '../components/InputField';

//Import from urql
import { useMutation } from 'urql';

interface registerProps {
    
}

const REGISTER_MUTATION = `
    mutation Register($username: String!, $password: String!) {
        register (options : {username: $username, password: $password}) {
          errors {
              field
              message
          }
          user {
              id
              username
          }
        }
    }
`

const Register: FC<registerProps> = ({}) => {

    const [registerMutationResult, doRegister] = useMutation(REGISTER_MUTATION);
    const {data, fetching, error} = registerMutationResult;

    useEffect(() => {
        console.log(error);
        console.log(data);
    }, [registerMutationResult])

    return (
        <Wrapper>
            <Formik 
                initialValues={{username: '', password: ''}}
                onSubmit={(values) => {
                    doRegister(values)
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
                            Register
                        </Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    );
}

export default Register;