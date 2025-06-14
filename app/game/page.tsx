import Link from "next/link"

export default function NewGame() {

    return (
        <div className="flex flex-col justify-center items-center w-full overscroll-none ">
            <section className="flex lg:w-1/4  mt-30 flex-col items-center py-12 justify-center sm:w-full px-2 bg-slate-100">
                <h1 className="text-xl text-blue-600 font-bold mb-2 ">New Game</h1>
                <div className="mb-2 text-lg text-blue-600">Choose your opponent:</div>
                <div className="mt-4 flex gap-4">
                    <Link href={"/vscomputer"} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded cursor-pointer">
                    Computer
                    </Link>
                    <Link href={"/vsplayer"} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded cursor-pointer">
                    Player
                    </Link>
                </div>
            </section>
        </div>
    )
}