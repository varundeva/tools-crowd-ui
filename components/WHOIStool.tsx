// components/WHOISTool.tsx

"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle, CalendarDays, FileSearch, Globe, Loader2, Server, ShieldCheck } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

// Define the structure of the WHOIS API response
interface WHOISResponse {
  error: boolean;
  domain: string;
  whoisServer: string;
  data: {
    "Domain Name": string;
    "Registrar": string;
    "Registrar URL": string;
    "Creation Date": string;
    "Updated Date": string;
    "Registry Expiry Date": string;
    "Domain Status": string;
    "Name Server": string[];
    "DNSSEC": string;
    "DNSSEC DS Data": string;
    // Add more fields if necessary
  };
  rawData: string;
}

export default function WHOISTool() {
  const [domain, setDomain] = useState("");
  const [result, setResult] = useState<WHOISResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

   
    
      // Handler for input changes
      const handleChange = (e) => {
        setDomain(e.target.value.trim());
      };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
     // Prevent submission if the domain is invalid
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
        `${process.env.NEXT_PUBLIC_API_URL}?tool=whois&domain=${encodeURIComponent(
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
      const data: WHOISResponse = await response.json();
      if (
        data.rawData?.includes("returned 0 objects") ||
        !data.data["Domain Name"] // or check for some essential field
      ) {
        // Show a domain-not-found or invalid-domain message
        setError("Domain does not exist or WHOIS data not available.");
        return;
      }
      setResult(data)
    } catch (error) {
      console.error("WHOIS Fetch Error:", error);
      setError("An error occurred while fetching WHOIS data.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Form Section */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            value={domain}
            onChange={handleChange}
            placeholder="Enter a domain name (e.g., example.com)"
            required
            className={`pl-10 border ${
              error ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
          />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Looking Up...
            </>
          ) : (
            "Lookup WHOIS"
          )}
        </Button>
      </form>

      {/* Error Alert */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

    {/* WHOIS Results */}
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
            <h3 className="text-3xl font-extrabold text-white">WHOIS Results</h3>
            <p className="text-white text-sm opacity-90">
              Domain: <span className="font-semibold">{result.data["Domain Name"]}</span>
            </p>
          </div>
        </CardContent>

        {/* Main Content */}
        <CardContent className="p-6 space-y-8 ">
          {/* 1. Domain Overview & Registrar Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Domain Overview */}
            <div>
              <h4 className="flex items-center text-lg font-semibold mb-3">
                <Globe className="w-5 h-5 mr-2 text-indigo-600" />
                Domain Overview
              </h4>
              <div className="space-y-2 text-sm text-current">
                <p>
                  <span className="font-medium">Domain Name:</span>{" "}
                  {result.data["Domain Name"]}
                </p>
                <p>
                  <span className="font-medium">Registry Domain ID:</span>{" "}
                  {result.data["Registry Domain ID"]}
                </p>
                <p>
                  <span className="font-medium">Domain Status:</span>{" "}
                  <span className="text-red-600">
                    {result.data["Domain Status"]}
                  </span>
                </p>
              </div>
            </div>

            {/* Registrar Info */}
            <div>
              <h4 className="flex items-center text-lg font-semibold mb-3">
                <FileSearch className="w-5 h-5 mr-2 text-indigo-600" />
                Registrar Info
              </h4>
              <div className="space-y-2 text-sm text-current">
                <p>
                  <span className="font-medium">Registrar:</span>{" "}
                  {result.data["Registrar"]}
                </p>
                <p>
                  <span className="font-medium">WHOIS Server:</span>{" "}
                  {result.data["Registrar WHOIS Server"]}
                </p>
                <p>
                  <span className="font-medium">Registrar URL:</span>{" "}
                  <a
                    href={result.data["Registrar URL"]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {result.data["Registrar URL"]}
                  </a>
                </p>
                <p>
                  <span className="font-medium">IANA ID:</span>{" "}
                  {result.data["Registrar IANA ID"]}
                </p>
                <p>
                  <span className="font-medium">Abuse Email:</span>{" "}
                  {result.data["Registrar Abuse Contact Email"] || "N/A"}
                </p>
                <p>
                  <span className="font-medium">Abuse Phone:</span>{" "}
                  {result.data["Registrar Abuse Contact Phone"] || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* 2. Registration Dates & Nameservers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Registration Dates */}
            <div>
              <h4 className="flex items-center text-lg font-semibold mb-3">
                <CalendarDays className="w-5 h-5 mr-2 text-indigo-600" />
                Registration Dates
              </h4>
              <div className="space-y-2 text-sm text-current">
                <p>
                  <span className="font-medium">Creation Date:</span>{" "}
                  {new Date(result.data["Creation Date"]).toLocaleString()}
                </p>
                <p>
                  <span className="font-medium">Updated Date:</span>{" "}
                  {new Date(result.data["Updated Date"]).toLocaleString()}
                </p>
                <p>
                  <span className="font-medium">Expiry Date:</span>{" "}
                  {new Date(result.data["Registry Expiry Date"]).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Nameservers */}
            <div>
              <h4 className="flex items-center text-lg font-semibold mb-3">
                <Server className="w-5 h-5 mr-2 text-indigo-600" />
                Nameservers
              </h4>
              <ul className="list-disc list-inside text-sm text-current space-y-1">
                {result.data["Name Server"].map((ns, index) => (
                  <li key={index}>{ns}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* 3. DNSSEC Info */}
          <div>
            <h4 className="flex items-center text-lg font-semibold mb-3">
              <ShieldCheck className="w-5 h-5 mr-2 text-indigo-600" />
              DNSSEC
            </h4>
            <div className="text-sm text-current space-y-2">
              <p>
                <span className="font-medium">DNSSEC:</span>{" "}
                {result.data["DNSSEC"]}
              </p>
              <p className="break-all">
                <span className="font-medium">DNSSEC DS Data:</span>{" "}
                {result.data["DNSSEC DS Data"]}
              </p>
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
