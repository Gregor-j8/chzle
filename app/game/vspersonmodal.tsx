export default function VsPersonModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    return (
<div className={`fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-90 ${isOpen ? 'flex' : 'hidden'}`}>
  <div className="bg-gray-800 text-white rounded-lg shadow-xl p-6 w-full max-w-md z-50">
    <h2 className="text-2xl font-bold text-center mb-6">Vs human</h2>
    <p className="mb-6">.</p>
    <div className="flex justify-end">
      <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-semibold transition">
        Close
      </button>
    </div>
  </div>
</div>
    )
  }