export default function NewPost() {
    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-gray-800 rounded-2xl shadow-lg p-6 space-y-6 border border-slate-700">
            <h1 className="text-2xl font-semibold text-white text-center">Create a New Post</h1>
            <input type="text" placeholder="Title"
              className="w-full rounded-lg bg-gray-700 text-white placeholder-slate-400 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-500" />
            <textarea placeholder="Write your post" rows={6}
              className="w-full rounded-lg bg-gray-700 text-white placeholder-slate-400 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-500 resize-none"/>
    
            <select className="w-full rounded-lg bg-gray-700 text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-500"
              >
            </select>
    
            <div className="flex justify-end">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">Post</button>
            </div>
          </div>
        </div>
      );    
  }