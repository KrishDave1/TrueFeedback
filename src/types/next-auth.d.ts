import 'next-auth'
import { DefaultSession } from 'next-auth';
import { decl } from 'postcss';

declare module 'next-auth' { // Both these interfaces are created here because we are using the CredentialsProvider which is not a part of the default next-auth package and we need to extend the User and Session interfaces to include the properties that we are using in the CredentialsProvider so we are essentially created custom interfaces for the User and Session.
    interface User {
        _id?: string;
        isVerified?: boolean;
        isAcceptingMessages?: boolean;
        username ?: string;
    }
    interface Session {
        user: {
            _id?: string;
            isVerified?: boolean;
            isAcceptingMessages?: boolean;
            username?: string;
        } & DefaultSession['user'];
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        _id?: string;
        isVerified?: boolean;
        isAcceptingMessages?: boolean;
        username?: string;
    }
}
