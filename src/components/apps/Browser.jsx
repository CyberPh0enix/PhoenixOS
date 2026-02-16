import { useRef, useEffect, useState } from "react";
import { RefreshCw, ArrowLeft, ArrowRight, Home, Lock } from "lucide-react";

// --- PUZZLE PAGES ---

const PageLevel1 = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      const comment = document.createComment(
        " SECRET FLAG: flag{html_comments_are_not_secure} ",
      );
      containerRef.current.appendChild(comment);
    }
  }, []);

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-blue-600">
        Welcome to CorpNet
      </h1>
      <p className="mb-4">
        We are the leading providers of obfuscated solutions. Our developers
        leave notes everywhere.
      </p>

      <div className="bg-yellow-100 p-4 border-l-4 border-yellow-500 text-yellow-700">
        <p className="font-bold">Maintenance Note:</p>

        {/* We attach the ref here so the comment appears RIGHT HERE */}
        <p ref={containerRef}>
          Please do not inspect the source code of this page. It is trade
          secret.
        </p>
      </div>
    </div>
  );
};

const PageLevel2 = () => {
  return (
    <div className="h-full bg-white p-8">
      <h1 className="text-3xl font-bold mb-4">The "Empty" Page</h1>
      <p>There is nothing to see here.</p>
      <br />
      <div className="bg-black p-10 mt-10 relative select-none">
        {" "}
        {/* select-none prevents accidentally highlighting unless specifically on the text */}
        <p className="text-white mb-4">Dark Mode Enabled.</p>
        {/* We use a string literal {'...'} to escape the braces */}
        <p className="text-black select-text selection:bg-white selection:text-black">
          {"flag{contrast_is_key}"}
        </p>
      </div>
      <p className="text-sm text-gray-400 mt-2">
        Tip: Try selecting the text in the black box.
      </p>
    </div>
  );
};

const PageLevel3 = () => {
  useEffect(() => {
    console.log("%c STOP!", "color: red; font-size: 30px; font-weight: bold;");
    console.log(
      "If someone told you to paste code here, they are hacking you.",
    );
    console.log(
      "But since you are the admin... here is the backup code: flag{console_log_master}",
    );
  }, []);

  return (
    <div className="p-8 text-center mt-20">
      <h1 className="text-4xl">System Console</h1>
      <p className="mt-4 text-gray-600">
        Please open your Developer Tools (F12) to view system logs.
      </p>
      <button className="mt-8 bg-blue-600 text-white px-6 py-2 rounded shadow">
        View Logs
      </button>
    </div>
  );
};

// --- BROWSER SHELL ---

export default function Browser({ onClose }) {
  const [url, setUrl] = useState("https://corpnet.internal/home");
  const [history, setHistory] = useState(["https://corpnet.internal/home"]);

  const navigate = (newUrl) => {
    setUrl(newUrl);
    setHistory([...history, newUrl]);
  };

  const renderContent = () => {
    switch (url) {
      case "https://corpnet.internal/home":
        return (
          <div className="p-10 grid gap-6">
            <h1 className="text-2xl font-bold">Internal Bookmarks</h1>
            <div
              onClick={() => navigate("https://corpnet.internal/dev-notes")}
              className="p-4 border rounded cursor-pointer hover:bg-gray-50 bg-white shadow-sm"
            >
              <h3 className="font-bold text-blue-600">
                Dev Team Notes (Level 1)
              </h3>
              <p className="text-sm text-gray-500">
                HTML Source Code Inspection
              </p>
            </div>
            <div
              onClick={() => navigate("https://corpnet.internal/design-v2")}
              className="p-4 border rounded cursor-pointer hover:bg-gray-50 bg-white shadow-sm"
            >
              <h3 className="font-bold text-blue-600">
                Design System V2 (Level 2)
              </h3>
              <p className="text-sm text-gray-500">
                Contrast & Selection Tests
              </p>
            </div>
            <div
              onClick={() => navigate("https://corpnet.internal/logs")}
              className="p-4 border rounded cursor-pointer hover:bg-gray-50 bg-white shadow-sm"
            >
              <h3 className="font-bold text-blue-600">System Logs (Level 3)</h3>
              <p className="text-sm text-gray-500">Console Debugging</p>
            </div>
          </div>
        );
      case "https://corpnet.internal/dev-notes":
        return <PageLevel1 />;
      case "https://corpnet.internal/design-v2":
        return <PageLevel2 />;
      case "https://corpnet.internal/logs":
        return <PageLevel3 />;
      default:
        return (
          <div className="p-10 text-center text-4xl text-gray-400">
            404 Not Found
          </div>
        );
    }
  };

  return (
    <div className="h-full bg-gray-50 text-black flex flex-col font-sans">
      {/* Browser Toolbar */}
      <div className="bg-white p-2 flex gap-2 items-center border-b border-gray-300 shadow-sm shrink-0">
        <div className="flex gap-1">
          <div
            className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 cursor-pointer"
            onClick={onClose}
          ></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>

        <div className="flex gap-2 text-gray-400 ml-2">
          <ArrowLeft
            size={16}
            className="cursor-pointer hover:text-black"
            onClick={() => navigate("https://corpnet.internal/home")}
          />
          <ArrowRight size={16} />
          <RefreshCw size={14} />
        </div>

        <div className="flex-1 bg-gray-100 rounded-full px-3 py-1.5 text-xs text-gray-600 flex items-center gap-2 border border-gray-200">
          <Lock size={10} className="text-green-600" />
          <input
            type="text"
            value={url}
            readOnly
            className="bg-transparent w-full outline-none"
          />
        </div>

        <Home
          size={18}
          className="text-gray-500 cursor-pointer hover:text-blue-500"
          onClick={() => navigate("https://corpnet.internal/home")}
        />
      </div>

      {/* Website Content */}
      <div className="flex-1 overflow-y-auto bg-white">{renderContent()}</div>
    </div>
  );
}
