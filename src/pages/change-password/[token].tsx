//Import from @chakra
import { Button, Box, Link, Flex } from "@chakra-ui/react";

//Import from formik
import { Formik, Form } from "formik";

//Import form Next.js
import { NextPage } from "next";
import router from "next/router";
import { useState } from "react";
import NextLink from 'next/link';

//Import other components
import InputField from "../../components/InputField";
import Wrapper from "../../components/Wrapper";

//Import mutations
import { useChangePasswordMutation } from "../../generated/graphql";

//Import urql client stuff
import { withUrqlClient } from "next-urql";
import createUrqlClient from "../../utils/createUrqlClient";

//Import utils
import { toErrorMap } from "../../utils/toErrorMap";

const ChangePassword: NextPage<{token: string}> = ({token}) => {

    const [, changePassword] = useChangePasswordMutation();
    const [tokenError, setTokenError] = useState('');
    
    return (
        <Wrapper>
            <Formik 
                initialValues={{ newPassword: '' }}
                onSubmit={async (values, { setErrors }) => {
                    const response = await changePassword({
                        newPassword: values.newPassword, 
                        token: token
                    }); 
                    if(response.data?.changePassword.errors) {
                        const errorMap = toErrorMap(response.data.changePassword.errors);
                        if('token' in errorMap) {
                            setTokenError(errorMap.token);
                        } 
                        setErrors(errorMap);
                    }
                    else if (response.data?.changePassword.user) {
                        router.push('/');
                    }
                }}    
            >
                {({isSubmitting}) => (
                    <Form>
                        <InputField
                            name='newPassword'
                            placeholder='Please, type in your new password'
                            label='New Password'
                            type='password'
                        />
                        {tokenError &&
                        <Flex>
                            <Box mr={2} color='red'>   
                                {tokenError}
                            </Box>
                            <NextLink href='/forgot-password'>
                            <Link>
                                Re-send an email for resetting password 
                            </Link>
                            </NextLink>
                        </Flex>
                        }
                        <Button 
                            mt={10} 
                            mx={'auto'} 
                            backgroundColor={'turquoise'} 
                            color={'white'} 
                            type='submit'
                            isLoading={isSubmitting}
                        >
                            Change Password
                        </Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    );

}

// Special Next.js function to get any query parameter (User token) 
ChangePassword.getInitialProps = ({query}) => {
    return {
        token: query.token as string,
    }
}

export default withUrqlClient(createUrqlClient)(ChangePassword);