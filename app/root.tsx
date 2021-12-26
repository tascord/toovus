import { Link, Links, LinksFunction, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from "remix";
import type { MetaFunction } from "remix";
import { FaHome, FaUser } from "react-icons/fa";
import { Stater } from "./helpers/stater";

export const meta: MetaFunction = () => {
  return { title: "Toovus" };
};

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: "/tailwind" },
  ]
}

export default function App() {

  let current_page = '/';
  Stater.on('nav.set_active', (id) => {
    current_page = id ?? '/';
  });

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>

        <Layout
          current_page={current_page}
        >
          <Outlet />
        </Layout>

        <ScrollRestoration />
        <Scripts />

        {process.env.NODE_ENV === "development" && <LiveReload />}

      </body>
    </html>
  );
}

function Layout({ children, current_page }: { children: JSX.Element, current_page: string }): JSX.Element {
  return (

    <>

      <nav>

        <NavIcon
          icon={<FaHome />}
          tooltip="Home"
          link="/"
          current_page={current_page}
        />

        // TODO: Logout if logged in ?
        <NavIcon
          icon={<FaUser />}
          tooltip="Account"
          link="/account"
          current_page={current_page}
        />

      </nav>

      <main>
        {children}
      </main>

    </>

  );
}

function NavIcon({ icon, tooltip, link, current_page }: { icon: JSX.Element, tooltip: string, link: string, current_page: string }): JSX.Element {

  return (

    <Link
      to={link}
      className={`tooltip group ${current_page === link ? 'active' : ''}`}
    >

      {icon}
      <span className="group-hover:scale-100">
        {tooltip}
      </span>

    </Link>

  )

}