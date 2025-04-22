import Link from "next/link";

export default function NavBar() {
    return (
        <nav className="">
        <div className="">
            <div className="">
            <Link href="/">Home</Link>
            </div>
            <ul className="">
            <li><Link href="/game">New game</Link></li>
            </ul>
        </div>
        </nav>
    )
}