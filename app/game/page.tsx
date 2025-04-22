import Link from "next/link";

export default function NewGame() {

    return (
        <div className="flex flex-col justify-center items-center w-full overscroll-none">
            <section className="flex w-1/4 mt-30 flex-col items-center py-12 justify-center bg-slate-100">
                <h1 className="text-xl font-bold mb-2 ">New Game</h1>
                <div className="mb-2 text-lg">Choose your opponent:</div>
                <div className="mt-4 flex gap-4">
                    <Link href={"/vscomputer"} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded cursor-pointer">
                    Vs Computer
                    </Link>
                    <Link href={"/"} className="bg-gray-500 hover:bg-gray-600 text-white font-bold px-4 rounded cursor-pointer">
                    Vs Player
                    </Link>
                </div>
            </section>

        </div>
    );
}