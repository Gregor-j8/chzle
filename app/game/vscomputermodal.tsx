
import Link from "next/link";

export default function VsComputerModal({ setAiLevel }: { setAiLevel: (level: number) => void;  }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="bg-white rounded-lg shadow-lg p-6 z-50">
        <h2 className="text-xl font-bold mb-4">Vs Computer</h2>
        <p>Choose difficulty to start</p>
        <select onChange={(e) => {setAiLevel(Number(e.target.value))}} className="mt-2 mb-4 border border-gray-300 rounded p-2 w-full">
            <option value="0">Choose difficulty</option>
            <option value="1">Easy</option>
            <option value="2">Medium</option>
            <option value="3">Hard</option>
        </select>
        <p>Choose color</p>
        <label htmlFor="radio">
            <input type="radio" name="color" value="white" 
            className="inline-block px-5 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium cursor-pointer"
             /> White
            <input type="radio" name="color" value="black" 
            className="inline-block px-5 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium cursor-pointer"
            /> Black
        </label>
        <div className="mt-4 flex justify-end">
          <button className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"><Link href={"/"}>Close</Link></button>
        </div>
      </div>
    </div>
  );
}