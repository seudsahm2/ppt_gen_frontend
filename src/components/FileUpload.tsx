import React from 'react';
import { UploadCloud, FileText } from 'lucide-react'; // Icons from lucide-react

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, isLoading }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onFileSelect(event.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-purple-50 to-indigo-100 rounded-xl shadow-xl border border-purple-200">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Upload Your PDF</h2>
      <label
        htmlFor="pdf-upload"
        className={`relative flex flex-col items-center justify-center w-full max-w-md h-48 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-300 ease-in-out
          ${isLoading ? 'bg-gray-100 border-gray-300 text-gray-400' : 'bg-white hover:bg-purple-50 border-purple-400 text-purple-600 hover:border-purple-600'}
        `}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          {isLoading ? (
            <FileText className="w-12 h-12 mb-3 text-gray-400" />
          ) : (
            <UploadCloud className="w-12 h-12 mb-3" />
          )}
          <p className="mb-2 text-sm">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500">PDF (MAX. 50MB)</p>
        </div>
        <input
          id="pdf-upload"
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={handleFileChange}
          disabled={isLoading}
        />
      </label>
      {isLoading && (
        <p className="mt-4 text-purple-600 font-medium">Uploading and processing...</p>
      )}
    </div>
  );
};

export default FileUpload;