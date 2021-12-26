import { json, LoaderFunction, redirect } from "remix";
import { User } from "~/utils/classes/User";
import { getSession, commitSession } from "~/utils/session.server";

export const loader: LoaderFunction = async ({ request }) => {

  const session = await getSession(request.headers.get('Cookie'));

  // Redirect if not logged in
  if (!session.has('token')) return redirect('/account');

  // Verify token
  let user: User;
  try { user = await User.from_token(session.get('token')); }

  // Invalid authorization
  catch (e) {
    session.unset('token');
    return redirect('/account', {
      headers: {
        'Set-Cookie': await commitSession(session)
      }
    })
  }

  return json({
    user
  });

}

export default function Index(): JSX.Element {

  return (

    <>

      <section>

        <h1 className="text-3xl text-teal-300 font-bold">
          Friends
        </h1>

        <hr />

        <h2>{ } friends online</h2>
        <ul>
          { }
        </ul>

      </section>

    </>

  );
}
