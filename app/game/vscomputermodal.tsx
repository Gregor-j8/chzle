import Link from "next/link";

Link
export default function VsComputerModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <div className={`fixed inset-0 flex items-center justify-center ${isOpen ? 'block' : 'hidden'}`}>
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="bg-white rounded-lg shadow-lg p-6 z-50">
        <h2 className="text-xl font-bold mb-4">Vs Computer</h2>
        <p>Choose difficulty</p>
        <select className="mt-2 mb-4 border border-gray-300 rounded p-2 w-full">
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
        </select>
        <p>Choose color</p>
        <label htmlFor="radio">
            <input type="radio" name="color" value="white" 
            className="inline-block px-5 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium     cursor-pointer"
             /> White
            <input type="radio" name="color" value="black" 
            className="inline-block px-5 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium cursor-pointer"
            /> Black
        </label>
        <div className="mt-4 flex justify-end">
          <button onClick={onClose} className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">Close</button>
          <button onClick={onClose} className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"><Link href={"/vscomputer"}>Start game</Link></button>
        </div>
      </div>
    </div>
  );
}