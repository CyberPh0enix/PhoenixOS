export default function Browser({ onClose }) {
  return (
    <div className="h-full bg-white text-black flex flex-col">
      <div className="bg-gray-200 p-2 flex gap-2 items-center border-b border-gray-300">
        <div
          className="w-3 h-3 rounded-full bg-red-500 cursor-pointer"
          onClick={onClose}
        ></div>
        <div className="flex-1 bg-white rounded px-2 text-xs py-1 text-gray-500">
          ph0enix.net/hidden-wiki
        </div>
      </div>
      <div className="flex-1 p-4">
        <h1 className="text-2xl font-bold">404 Not Found</h1>
        <p>The requested resource was deleted by the administrator.</p>
      </div>
    </div>
  );
}
