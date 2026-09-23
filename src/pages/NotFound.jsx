import { Link } from "react-router-dom"
import { useTitle } from "../components/ui"

export default function NotFound() {
  useTitle("Not found")
  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <h1 className="font-display text-5xl">That page is not on the map.</h1>
      <Link to="/" className="mt-6 inline-flex rounded-full bg-navy px-5 py-3 text-sm text-white">
        Back home
      </Link>
    </div>
  )
}
