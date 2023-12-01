import {
    CallbackHandlerError,
    handleAuth,
    handleCallback,
    handleLogin,
    IdentityProviderError
} from '@auth0/nextjs-auth0';
import {NextResponse} from "next/server";

export const GET = handleAuth({
    login: async (req, res) => {
        return await handleLogin(req, res, {
            authorizationParams: {
                // Prompts login again in the case where a user was rejected by rule.
                // Allows the user to try to login with a different account.
                // Ref: https://github.com/auth0/nextjs-auth0/issues/517
                prompt: 'login',
            }
        })
    },
    callback: async (req, res) =>{
        try {
            return await handleCallback(req, res);
        } catch (error) {
            if (error instanceof CallbackHandlerError && error.cause instanceof IdentityProviderError) {
                if (error.cause.error === "access_denied") {
                    // Our login rule has a white list of allowed emails:
                    // error: 'access_denied',
                    // errorDescription: 'user_not_in_allowed_list',

                    console.error("Access denied - user not whitelisted.", error);
                    return NextResponse.redirect(new URL('/access-denied', req.url))
                }
            } else {
                console.error("Unhandled callback error: ", error);
            }
        }

        return NextResponse.json({ error: 'Callback error' }, { status: 500 })
    }
});
