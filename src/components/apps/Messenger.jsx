export default function Messenger({ onClose }) {
  return (
    <div className="h-full bg-neutral-900 text-white flex flex-col">
      <div className="bg-neutral-800 p-3 flex justify-between items-center shadow-lg">
        <span className="font-bold">Encrypted Chat</span>
        <button
          onClick={onClose}
          className="text-sm bg-neutral-700 px-2 py-1 rounded"
        >
          Close
        </button>
      </div>
      <div className="flex-1 p-4 flex items-center justify-center text-neutral-500">
        No active signals...
      </div>
    </div>
  );
}
