export default function VsPersonModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    return (
      <div className={`fixed inset-0 flex items-center justify-center ${isOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
        <div className="bg-white rounded-lg shadow-lg p-6 z-50">
          <h2 className="text-xl font-bold mb-4">Vs human</h2>
          <p>.</p>
          <div className="mt-4 flex justify-end">
            <button onClick={onClose} className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">Close</button>
          </div>
        </div>
      </div>
    );
  }