import type { LoaderFunction } from "remix"
import { serveTailwindCss } from "remix-tailwind"

export const loader: LoaderFunction = ({ params }) => serveTailwindCss(`app/styles/pages/${params.file}.css`)