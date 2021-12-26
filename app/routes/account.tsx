import React from "react";
import { ActionFunction, Form, json, LinksFunction, LoaderFunction, MetaFunction, redirect, useActionData, useLoaderData } from "remix";
import { Stater } from "~/helpers/stater";
import { User } from "~/utils/classes/User";
import { register_account } from "~/utils/db.server";
import { commitSession, getSession } from "~/utils/session.server";

export const meta: MetaFunction = () => {
    return { title: "Toovus // Account" };
};

export const links: LinksFunction = () => {
    return [
        { rel: "stylesheet", href: "/tailwind/account" },
    ]
}

export const loader: LoaderFunction = async ({ request }) => {

    const session = await getSession(request.headers.get('Cookie'));

    // Redirect if logged in
    if (session.has('token')) {

        // Verify token
        try {
            await User.from_token(session.get('token'));
            return redirect('/');
        }


        // Invalid authorization
        catch (e) {
            console.log(`Logging out due to '${e}'`);
            session.unset('token');
            return redirect('/account', {
                headers: {
                    'Set-Cookie': await commitSession(session)
                }
            })
        }

    }

    return json({});

}

export const action: ActionFunction = async ({ request }) => {

    const data = await request.formData();

    // Register
    if (data.has('username')) {

        try {

            let user = await register_account(
                data.get('username')?.toString() ?? '',
                data.get('email')?.toString() ?? '',
                data.get('password')?.toString() ?? '',
            );

            // Set session
            const session = await getSession(request.headers.get('Cookie'));
            session.set('token', user.generate_token());
            return redirect('/', {
                headers: {
                    'Set-Cookie': await commitSession(session)
                }
            });

        } catch (err) {
            return json(err);
        }

    }

    // Login
    else {

        try {

            let user = await User.from_login(
                data.get('email')?.toString() ?? '',
                data.get('password')?.toString() ?? ''
            );

            // Set session
            const session = await getSession(request.headers.get('Cookie'));
            session.set('token', user.generate_token());
            return redirect('/', {
                headers: {
                    'Set-Cookie': await commitSession(session)
                }
            });

        } catch (err) {
            return json(err);
        }

    }

}

export default function Index(): JSX.Element {

    Stater.emit('nav.set_active', 'account');

    const error: string | undefined = useActionData();
    const [isRegistering, setIsRegistering] = React.useState(false);

    return (

        <Form method="post">

            <h1 className="text-3xl text-teal-400 font-bold">
                {isRegistering ? 'Register' : 'Login'}
            </h1>

            <a
                href="#"
                className="text-semibold text-teal-100"
                onClick={() => setIsRegistering(!isRegistering)}
            >
                {isRegistering ? 'Login' : 'Register'}?
            </a>

            <hr
                className="mt-3 mb-[-1rem]"
            />

            <span className="mt-6 text-red-500">{error}</span>

            {
                isRegistering &&
                <label>
                    Username
                    <input type="text" name="username" required />
                </label>
            }

            <label>
                Email
                <input type="email" name="email" required />
            </label>


            <label>
                Password
                <input type="password" name="password" required />
            </label>

            <button type="submit">
                {isRegistering ? 'Register' : 'Login'}
            </button>

        </Form>

    )

}