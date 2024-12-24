// components/HTTPHeaderTool.tsx

"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  Globe,
  Loader2,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

// Define the structure of the HTTP Headers API response
interface HTTPHeadersResponse {
  error: boolean;
  domain: string;
  headers: Record<string, string>;
  rawData: string;
}

export default function HTTPHeaderTool() {
  const [domain, setDomain] = useState("");
  const [result, setResult] = useState<HTTPHeadersResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Handler for input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDomain(e.target.value.trim());
  };

  // Handler for form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Regular expression for validating domain names
    const domainRegex = /^(?!:\/\/)([a-zA-Z0-9-]{1,63}\.)+[a-zA-Z]{2,63}$/;
    if (!domainRegex.test(domain)) {
      setError("Please enter a valid domain name (e.g., example.com).");
      setResult(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}?tool=http&domain=${encodeURIComponent(
          domain
        )}`,
        {
          method: "POST",
          headers: {
            "x-api-key": process.env.X_API_KEY as string,
            "Content-Type": "application/json",
          },
        }
      );
      const data: HTTPHeadersResponse = await response.json();

      if (response.ok && !data.error) {
        // Check if headers data is empty
        if (!data.headers || Object.keys(data.headers).length === 0) {
          setError("No HTTP headers found for this domain.");
        } else {
          setResult(data);
        }
      } else {
        setError(data.rawData || "Failed to fetch HTTP headers.");
      }
    } catch (err) {
      console.error("HTTP Headers Fetch Error:", err);
      setError("An error occurred while fetching HTTP headers.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto py-6 space-y-6">
      {/* Form Section */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Domain Input Field */}
        <div className="relative">
          <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            value={domain}
            onChange={handleChange}
            placeholder="Enter a domain name (e.g., example.com)"
            required
            className={`pl-10 border ${
              error ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? "domain-error" : undefined}
          />
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
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Looking Up...
            </>
          ) : (
            "Lookup HTTP Headers"
          )}
        </Button>
      </form>

      {/* HTTP Headers Results */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="shadow-2xl rounded-lg overflow-hidden">
              {/* Gradient Header */}
              <CardContent className="bg-gradient-to-r from-slate-950 to-slate-100 p-6">
                <div className="flex flex-col gap-1">
                  <h3 className="text-3xl font-extrabold text-white">HTTP Headers</h3>
                  <p className="text-white text-sm opacity-90">
                    Domain: <span className="font-semibold">{result.domain}</span>
                  </p>
                </div>
              </CardContent>

              {/* Main Content */}
              <CardContent className="p-6 ">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-current uppercase tracking-wider"
                        >
                          Header
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-current uppercase tracking-wider"
                        >
                          Value
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {Object.entries(result.headers).map(([key, value], index) => (
                        <tr key={index} >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold">
                            {key}
                          </td>
                          <td className="px-6 py-4 whitespace-normal text-smbreak-words">
                            {value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
