import { NextPage } from "next";

const ChangePassword: NextPage<{token: string}> = ({token}) => {
    
    return (
        <div>
            token is {token}
        </div>
    );

}

// Special Next.js function to get any query parameter (User token) 
ChangePassword.getInitialProps = ({query}) => {
    return {
        token: query.token as string,
    }
}

export default ChangePassword;