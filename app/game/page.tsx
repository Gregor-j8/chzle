'use client';
import { useState } from "react";
import VsComputerModal from "./vscomputermodal";
import VsPersonModal from "./vspersonmodal";

export default function NewGame() {
    const [ComputerModalIsOpen, setComputerModalIsOpen] = useState<boolean>(false);
    const [humanModalIsOpen, setHumanModalIsOpen] = useState<boolean>(false);
    return (
        <div className="flex flex-col justify-center items-center w-full overscroll-none">
            <section className="flex w-1/4 mt-30 flex-col items-center py-12 justify-center bg-slate-100">
                <h1 className="text-xl font-bold mb-2 ">New Game</h1>
                <div className="mb-2 text-lg">Choose your opponent:</div>
                <div className="mt-4 flex gap-4">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded cursor-pointer" onClick={() => setComputerModalIsOpen(true)}>
                    Vs Computer
                    </button>
                    <button className="bg-gray-500 hover:bg-gray-600 text-white font-bold px-4 rounded cursor-pointer"onClick={() => setHumanModalIsOpen(true)}>
                    Vs Player
                    </button>
                </div>
            </section>
                {ComputerModalIsOpen && (
                    <VsComputerModal isOpen={ComputerModalIsOpen} onClose={() => setComputerModalIsOpen(false)} />
                )}
                {humanModalIsOpen && (
                    <VsPersonModal isOpen={humanModalIsOpen} onClose={() => setHumanModalIsOpen(false)} />
                )}
        </div>
    );
}