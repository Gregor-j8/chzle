import Link from "next/link";

export default function NavBar() {
    return (
        <nav className="navbar">
        <div className="navbar__container">
            <div className="navbar__logo">
            <Link href="/">Home</Link>
            </div>
            <ul className="navbar__links">
            <li><Link href="/game">New game</Link></li>
            </ul>
        </div>
        </nav>
    )
}