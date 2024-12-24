/* eslint-disable @typescript-eslint/no-explicit-any */
// components/DNSTool.tsx

"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  FileSearch,
  Globe,
  Loader2,
  Server,
  ShieldCheck,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

// Define the structure of the DNS API response
interface DNSRecord {
  host: string;
  class: string;
  ttl: number;
  type: string;
  [key: string]: any; // For additional fields like 'ip', 'target', etc.
}

interface DNSResponse {
  error: boolean;
  domain: string;
  data: {
    A?: DNSRecord[];
    NS?: DNSRecord[];
    SOA?: DNSRecord[];
    TXT?: DNSRecord[];
    // Add more record types if necessary
  };
  rawData: string;
}

export default function DNSTool() {
  const [domain, setDomain] = useState("");
  const [result, setResult] = useState<DNSResponse | null>(null);
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
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}?tool=dns&domain=${encodeURIComponent(
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
      const data: DNSResponse = await response.json();

      if (response.ok && !data.error) {
        // Check if DNS data is empty or indicates no results
        const isEmpty =
          !data.data.A &&
          !data.data.NS &&
          !data.data.SOA &&
          !data.data.TXT;

        if (isEmpty) {
          setError("DNS data is not available for this domain.");
          return;
        }

        setResult(data);
      } else {
        setError(data.rawData || "Failed to fetch DNS data.");
      }
    } catch (err) {
      console.error("DNS Fetch Error:", err);
      setError("An error occurred while fetching DNS data.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto p-6">
      {/* Form Section */}
      <form onSubmit={handleSubmit} className="space-y-6">
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
            "Lookup DNS"
          )}
        </Button>
      </form>

      {/* DNS Results */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="mt-8"
          >
            <Card className="shadow-2xl rounded-lg overflow-hidden">
              {/* Gradient Header */}
              <CardContent className="bg-gradient-to-r from-slate-950 to-slate-100 p-6">
                <div className="flex flex-col gap-1">
                  <h3 className="text-3xl font-extrabold text-white">DNS Results</h3>
                  <p className="text-white text-sm opacity-90">
                    Domain: <span className="font-semibold">{result.domain}</span>
                  </p>
                </div>
              </CardContent>

              {/* Main Content */}
              <CardContent className="p-6 space-y-8">
                {/* 1. A Records */}
                {result.data.A && result.data.A.length > 0 && (
                  <div>
                    <h4 className="flex items-center text-lg font-semibold mb-3">
                      <Server className="w-5 h-5 mr-2 text-indigo-600" />
                      A Records
                    </h4>
                    <div className="flex flex-wrap -mx-2 text-sm text-current">
  {result.data.A.map((record, index) => (
    <div key={index} className="w-full md:w-1/2 px-2 mb-4">
      <div className="p-4 border rounded-md">
        <p>
          <span className="font-medium">Host:</span> {record.host}
        </p>
        <p>
          <span className="font-medium">IP:</span> {record.ip}
        </p>
        <p>
          <span className="font-medium">TTL:</span> {record.ttl}
        </p>
      </div>
    </div>
  ))}
</div>
                  </div>
                )}

                {/* 2. NS Records */}
                {result.data.NS && result.data.NS.length > 0 && (
                  <div>
                    <h4 className="flex items-center text-lg font-semibold mb-3">
                      <Server className="w-5 h-5 mr-2 text-indigo-600" />
                      NS Records
                    </h4>
                    <ul className="list-inside text-sm text-current space-y-1 list-none">
                      {result.data.NS.map((record, index) => (
                        <li key={index}>NS{index+1} : {record.target}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 3. SOA Records */}
                {result.data.SOA && result.data.SOA.length > 0 && (
                  <div>
                    <h4 className="flex items-center text-lg font-semibold mb-3">
                      <FileSearch className="w-5 h-5 mr-2 text-indigo-600" />
                      SOA Records
                    </h4>
                    <div className="space-y-2  flex flex-wrap -mx-2 text-sm text-current">
                      {result.data.SOA.map((record, index) => (
                         <div key={index} className="w-full md:w-1/2 px-2 mb-4">
                        <div className="p-4 border rounded-md ">
                          <p>
                            <span className="font-medium">MNAME:</span> {record.mname}
                          </p>
                          <p>
                            <span className="font-medium">RNAME:</span> {record.rname}
                          </p>
                          <p>
                            <span className="font-medium">Serial:</span> {record.serial}
                          </p>
                          <p>
                            <span className="font-medium">Refresh:</span> {record.refresh}
                          </p>
                          <p>
                            <span className="font-medium">Retry:</span> {record.retry}
                          </p>
                          <p>
                            <span className="font-medium">Expire:</span> {record.expire}
                          </p>
                          <p>
                            <span className="font-medium">Minimum TTL:</span> {record["minimum-ttl"]}
                          </p>
                        </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. TXT Records */}
                {result.data.TXT && result.data.TXT.length > 0 && (
                  <div>
                    <h4 className="flex items-center text-lg font-semibold mb-3">
                      <ShieldCheck className="w-5 h-5 mr-2 text-indigo-600" />
                      TXT Records
                    </h4>
                    <div className=" text-sm text-current flex flex-wrap -mx-2">
                      {result.data.TXT.map((record, index) => (
                         <div key={index} className="w-full md:w-1/2 px-2 mb-4">
                        <div className="p-4 border rounded-md ">
                          <p>
                            <span className="font-medium">Host:</span> {record.host}
                          </p>
                          <p>
                            <span className="font-medium">TXT:</span> {record.txt}
                          </p>
                          {/* Display all entries if available */}
                          {record.entries && record.entries.length > 1 && (
                            <div className="mt-2">
                              <span className="font-medium">Entries:</span>
                              <ul className="list-disc list-inside">
                                {record.entries.map((entry:any, idx:any) => (
                                  <li key={idx}>{entry}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                        </div>
                      ))}
                    </div>
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
