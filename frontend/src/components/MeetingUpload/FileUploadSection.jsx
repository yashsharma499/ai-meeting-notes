import { Upload, X } from "lucide-react";

export default function FileUploadSection({ uploadedFile, handleFileUpload, removeUploadedFile }) {
  return (
    <div>
      <label className="text-sm text-gray-300 font-semibold flex items-center gap-2 mb-2">
        <Upload size={18} /> Upload Notes (.txt)
      </label>

      <div className="flex items-center gap-3">
        <input
          type="file"
          accept=".txt"
          onChange={handleFileUpload}
          className="w-full bg-white/10 border border-white/20 rounded-xl p-2 text-gray-200 cursor-pointer"
        />

        {uploadedFile && (
          <button 
            onClick={removeUploadedFile}
            className="p-2 bg-red-600/30 border border-red-500/40 rounded-lg hover:bg-red-600/40 text-red-300"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {uploadedFile && (
        <p className="text-xs text-gray-400 mt-1">Attached: {uploadedFile.name}</p>
      )}
    </div>
  );
}
