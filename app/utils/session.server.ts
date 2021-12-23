import { createCookieSessionStorage } from "@remix-run/server-runtime";

const { getSession, commitSession, destroySession } = createCookieSessionStorage({  
    
    cookie: {
        name: '__session',
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2), // 2 days
        secure: process.env.NODE_ENV === 'production',
    }

})

export {
    getSession,
    commitSession,
    destroySession
};