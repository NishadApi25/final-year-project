"use client";

import { useState } from "react";

interface Props {
  link: string;
  onClose: () => void;
}

export default function AffiliateLinkModal({ link, onClose }: Props) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded shadow w-96">
        <h2 className="text-lg font-bold mb-4">Your Affiliate Link</h2>
        <input
          type="text"
          value={link}
          readOnly
          className="w-full border p-2 rounded mb-4"
        />
        <div className="flex justify-between">
          <button
            onClick={copyToClipboard}
            className="bg-blue-600 text-white py-1 px-3 rounded"
          >
            {copied ? "Copied!" : "Copy Link"}
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-black py-1 px-3 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
