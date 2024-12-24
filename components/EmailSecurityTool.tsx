// components/EmailSecurityTool.tsx

"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  Globe,
  Loader2,
  Shield,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

// Define the structure of the Email Security API response
interface SPFRecord {
  host: string;
  class: string;
  ttl: number;
  type: string;
  txt: string;
  entries: string[];
}

interface DKIMRecord {
  host: string;
  class: string;
  ttl: number;
  type: string;
  txt: string;
  entries: string[];
}

interface DMARCRecord {
  // Define fields if available; assuming similar structure
  host: string;
  class: string;
  ttl: number;
  type: string;
  txt: string;
  entries: string[];
}

interface EmailSecurityData {
  SPF: SPFRecord[];
  DKIM: DKIMRecord[];
  DMARC: DMARCRecord[];
}

interface EmailSecurityResponse {
  error: boolean;
  domain: string;
  data: EmailSecurityData;
  rawData: string;
}

export default function EmailSecurityTool() {
  const [domain, setDomain] = useState("");
  const [result, setResult] = useState<EmailSecurityResponse | null>(null);
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
        `${process.env.NEXT_PUBLIC_API_URL}?tool=email-security&domain=${encodeURIComponent(
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
      const data: EmailSecurityResponse = await response.json();

      if (response.ok && !data.error) {
        // Check if all records are empty
        const isEmpty =
          (!data.data.SPF || data.data.SPF.length === 0) &&
          (!data.data.DKIM || data.data.DKIM.length === 0) &&
          (!data.data.DMARC || data.data.DMARC.length === 0);

        if (isEmpty) {
          setError("No Email Security records found for this domain.");
        } else {
          setResult(data);
        }
      } else {
        setError(data.rawData || "Failed to fetch Email Security data.");
      }
    } catch (err) {
      console.error("Email Security Fetch Error:", err);
      setError("An error occurred while fetching Email Security data.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto p-6 space-y-6">
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
            "Lookup Email Security"
          )}
        </Button>
      </form>

      {/* Email Security Results */}
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
                  <h3 className="text-3xl font-extrabold">
                    Email Security Details
                  </h3>
                  <p className=" text-sm opacity-90">
                    Domain: <span className="font-semibold">{result.domain}</span>
                  </p>
                </div>
              </CardContent>

              {/* Main Content */}
              <CardContent className="p-6 space-y-8 ">
                {/* 1. SPF Records */}
                {result.data.SPF && result.data.SPF.length > 0 && (
                  <div>
                    <h4 className="flex items-center text-lg font-semibold mb-3">
                      <Mail className="w-5 h-5 mr-2 text-green-600" />
                      SPF Records
                    </h4>
                    <div className="flex flex-wrap -mx-2 text-sm text-current">
                      {result.data.SPF.map((record, index) => (
                        <div key={index} className="w-full md:w-1/2 px-2 mb-4">
                          <div className="p-4 border rounded-md ">
                            <p className="whitespace-normal break-words">
                              <span className="font-medium">Host:</span> {record.host}
                            </p>
                            <p className="whitespace-normal break-words">
                              <span className="font-medium">Type:</span> {record.type}
                            </p>
                            <p className="whitespace-normal break-words"> 
                              <span className="font-medium">TTL:</span> {record.ttl}
                            </p>
                            <p className="whitespace-normal break-words">
                              <span className="font-medium">TXT:</span> {record.txt}
                            </p>
                            <p>
                              <span className="font-medium">Entries:</span>
                            </p>
                            <ul className="list-none list-inside pl-4">
                              {record.entries.map((entry, idx) => (
                                <li key={idx} className="whitespace-normal break-words">{entry}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. DKIM Records */}
                {result.data.DKIM && result.data.DKIM.length > 0 && (
                  <div>
                    <h4 className="flex items-center text-lg font-semibold mb-3">
                      <ShieldCheck className="w-5 h-5 mr-2 text-green-600" />
                      DKIM Records
                    </h4>
                    <div className="flex flex-wrap -mx-2 text-sm text-current">
                      {result.data.DKIM.map((record, index) => (
                        <div key={index} className="w-full md:w-1/2 px-2 mb-4">
                          <div className="p-4 border rounded-md ">
                            <p className="whitespace-normal break-words">
                              <span className="font-medium">Host:</span> {record.host}
                            </p>
                            <p className="whitespace-normal break-words">
                              <span className="font-medium">Type:</span> {record.type}
                            </p>
                            <p className="whitespace-normal break-words">
                              <span className="font-medium">TTL:</span> {record.ttl}
                            </p>
                            <p className="whitespace-normal break-words">
                              <span className="font-medium">TXT:</span> {record.txt}
                            </p>
                            <p>
                              <span className="font-medium">Entries:</span>
                            <ul className="list-none list-inside pl-4">
                              {record.entries.map((entry, idx) => (
                              <li key={idx} className="whitespace-normal break-words">{entry}</li>
                              ))}
                            </ul>
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. DMARC Records */}
                {result.data.DMARC && result.data.DMARC.length > 0 ? (
                  <div>
                    <h4 className="flex items-center text-lg font-semibold mb-3">
                      <Shield className="w-5 h-5 mr-2 text-green-600" />
                      DMARC Records
                    </h4>
                    <div className="flex flex-wrap -mx-2 text-sm text-current">
                      {result.data.DMARC.map((record, index) => (
                        <div key={index} className="w-full md:w-1/2 px-2 mb-4">
                          <div className="p-4 border rounded-md ">
                            <p className="whitespace-normal break-words">
                              <span className="font-medium">Host:</span> {record.host}
                            </p>
                            <p className="whitespace-normal break-words">
                              <span className="font-medium">Type:</span> {record.type}
                            </p>
                            <p className="whitespace-normal break-words">
                              <span className="font-medium">TTL:</span> {record.ttl}
                            </p>
                            <p className="whitespace-normal break-words">
                              <span className="font-medium">TXT:</span> {record.txt}
                            </p>
                            <p className="whitespace-normal break-words">
                              <span className="font-medium">Entries:</span>
                            </p>
                            <ul className="list-none list-inside pl-4">
                              {record.entries.map((entry, idx) => (
                                <li className="whitespace-normal break-words" key={idx}>{entry}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-4 border rounded-md">
                    <p className="text-yellow-800">
                      No DMARC records found for this domain.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
