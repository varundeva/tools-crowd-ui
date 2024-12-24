// components/PDFCompressTool.tsx

"use client";

import { useState } from "react";
import { File, Loader2, Download, AlertCircle, Clipboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

export default function PDFCompressTool() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadFileName, setDownloadFileName] = useState<string | null>(null);

  // Handler for file input changes
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setDownloadUrl(null);
    setDownloadFileName(null);
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        setError("Please upload a valid PDF file.");
        return;
      }
      if (selectedFile.size > 50 * 1024 * 1024) { // 50 MB limit
        setError("File size exceeds the 50MB limit.");
        return;
      }
      setFile(selectedFile);
    }
  };

  // Handler for form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setDownloadUrl(null);
    setDownloadFileName(null);

    if (!file) {
      setError("Please select a PDF file to compress.");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("pdf", file); // Ensure the key is 'pdf'

      const response = await fetch(`/pdf.php`, { // Update to your actual API endpoint
        method: "POST",
        body: formData,
      });

      const contentType = response.headers.get("Content-Type");

      if (contentType && contentType.includes("application/pdf")) {
        // Successful compression, handle PDF download
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        setDownloadUrl(url);
        setDownloadFileName(`compressed_${file.name}`);
      } else {
        // Handle error message
        const errorMessage = await response.text();
        setError(errorMessage);
      }
    } catch (err) {
      console.error("PDF Compress Error:", err);
      setError("An error occurred while compressing the PDF.");
    } finally {
      setIsLoading(false);
    }
  };

  // Utility function to format bytes to KB/MB
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Handler to trigger download
  const handleDownload = () => {
    if (downloadUrl && downloadFileName) {
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = downloadFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(null);
      setDownloadFileName(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Form Section */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File Input Field */}
        <div className="flex items-center space-x-4">
          <label className="flex flex-col items-center px-4 py-6 bg-white text-blue-600 rounded-lg shadow-lg tracking-wide uppercase border border-blue-600 cursor-pointer hover:bg-blue-100">
            <File className="w-8 h-8" />
            <span className="mt-2 text-base leading-normal">Select PDF</span>
            <input
              type="file"
              className="hidden"
              accept="application/pdf"
              onChange={handleFileChange}
            />
          </label>
          {file && (
            <div className="flex flex-col">
              <span className="text-gray-700 font-medium">{file.name}</span>
              <span className="text-gray-500 text-sm">
                Size: {formatBytes(file.size)}
              </span>
            </div>
          )}
        </div>

        {/* Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Alert variant="destructive" className="flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 mt-1" />
                <div>
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </div>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full flex items-center justify-center"
          disabled={isLoading || !file}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Compressing...
            </>
          ) : (
            "Compress PDF"
          )}
        </Button>
      </form>

      {/* Compression Results */}
      <AnimatePresence>
        {downloadUrl && downloadFileName && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="mt-8"
          >
            <Card className="shadow-2xl rounded-lg overflow-hidden">
              {/* Header */}
              <CardContent className="bg-green-500 p-6">
                <div className="flex items-center space-x-2">
                  <Download className="w-6 h-6 text-white" />
                  <h3 className="text-2xl font-bold text-white">Compression Successful!</h3>
                </div>
              </CardContent>

              {/* Details */}
              <CardContent className="p-6 bg-white">
                <div className="space-y-4">
                  <div>
                    <span className="font-medium">Original File:</span> {file?.name}
                  </div>
                  <div>
                    <span className="font-medium">Compressed File:</span> {downloadFileName}
                  </div>
                  <div className="flex items-center space-x-4">
                    <Button
                      onClick={handleDownload}
                      className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Download Compressed PDF
                    </Button>
                    <Button
                      onClick={() => {
                        if (downloadUrl) {
                          navigator.clipboard.writeText(downloadUrl);
                        }
                      }}
                      className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
                    >
                      <Clipboard className="w-5 h-5 mr-2" />
                      Copy Download Link
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
