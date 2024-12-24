/* eslint-disable @typescript-eslint/no-explicit-any */
// components/SSLCertTool.tsx

"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  CalendarDays,
  FileSearch,
  Globe,
  Loader2,
  Lock,
  ShieldCheck,
  ShieldPlus,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

// Define the structure of the SSL API response
interface SSLIssuer {
  C: string;
  O: string;
  CN: string;
}

interface SSLSubject {
  CN: string;
}

interface SSLExtensions {
  public_key: string;
  keyUsage: string;
  extendedKeyUsage: string;
  basicConstraints: string;
  subjectKeyIdentifier: string;
  authorityKeyIdentifier: string;
  authorityInfoAccess: string;
  subjectAltName: string;
  certificatePolicies: string;
  crlDistributionPoints: string;
  ct_precert_scts: string;
}

interface SSLData {
  common_name: any;
  issuer: SSLIssuer;
  subject: SSLSubject;
  validFrom: string;
  validTo: string;
  serialNumber: string;
  signatureAlgorithm: string;
  extensions: SSLExtensions;
}

interface SSLResponse {
  error: boolean;
  domain: string;
  data: SSLData;
  rawData: string;
}

export default function SSLTool() {
  const [domain, setDomain] = useState("");
  const [result, setResult] = useState<SSLResponse | null>(null);
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
        `${process.env.NEXT_PUBLIC_API_URL}?tool=ssl&domain=${encodeURIComponent(
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
      const data: SSLResponse = await response.json();

      if (response.ok && !data.error) {
        // Check if SSL data is empty or indicates no results
        if (
          data.rawData &&
          (data.rawData.includes("No SSL certificate found") ||
            !data.data.common_name)
        ) {
          setError("SSL certificate does not exist or data is not available.");
        } else {
          setResult(data);
        }
      } else {
        setError(data.rawData || "Failed to fetch SSL data.");
      }
    } catch (err) {
      console.error("SSL Fetch Error:", err);
      setError("An error occurred while fetching SSL data.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className=" mx-auto p-6 space-y-6">
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
            "Lookup SSL"
          )}
        </Button>
      </form>

      {/* SSL Results */}
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
              <CardContent className="bg-gradient-to-r from-slate-950 to-slate-100  p-6">
                <div className="flex flex-col gap-1">
                  <h3 className="text-3xl font-extrabold text-white">
                    SSL Certificate Details
                  </h3>
                  <p className="text-white text-sm opacity-90">
                    Domain: <span className="font-semibold">{result.domain}</span>
                  </p>
                </div>
              </CardContent>

              {/* Main Content */}
              <CardContent className="p-6 space-y-8 ">
                {/* 1. Certificate Overview */}
                <div className="flex flex-wrap -mx-2">
                  <div className="w-full md:w-1/2 px-2 mb-4">
                    <h4 className="flex items-center text-lg font-semibold mb-3">
                      <ShieldPlus className="w-5 h-5 mr-2 text-indigo-600" />
                      Certificate Overview
                    </h4>
                    <div className="space-y-2 text-sm text-current">
                      <p>
                        <span className="font-medium">Common Name:</span>{" "}
                        {result.data.subject.CN}
                      </p>
                      <p>
                        <span className="font-medium">Issuer:</span>{" "}
                        {result.data.issuer.O} ({result.data.issuer.C})
                      </p>
                      <p>
                        <span className="font-medium">Serial Number:</span>{" "}
                        {result.data.serialNumber}
                      </p>
                      <p>
                        <span className="font-medium">Signature Algorithm:</span>{" "}
                        {result.data.signatureAlgorithm}
                      </p>
                    </div>
                  </div>

                  {/* 2. Validity Period */}
                  <div className="w-full md:w-1/2 px-2 mb-4">
                    <h4 className="flex items-center text-lg font-semibold mb-3">
                      <CalendarDays className="w-5 h-5 mr-2 text-indigo-600" />
                      Validity Period
                    </h4>
                    <div className="space-y-2 text-sm text-current">
                      <p>
                        <span className="font-medium">Valid From:</span>{" "}
                        {new Date(result.data.validFrom).toLocaleString()}
                      </p>
                      <p>
                        <span className="font-medium">Valid To:</span>{" "}
                        {new Date(result.data.validTo).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3. Technical Details */}
                <div className="flex flex-wrap -mx-2">
                  <div className="w-full md:w-1/2 px-2 mb-4">
                    <h4 className="flex items-center text-lg font-semibold mb-3">
                      <Lock className="w-5 h-5 mr-2 text-indigo-600" />
                      Technical Details
                    </h4>
                    <div className="space-y-2 text-sm text-current">
                      <p>
                        <span className="font-medium">Key Algorithm:</span>{" "}
                        {result.data.extensions.keyUsage}
                      </p>
                      <p>
                        <span className="font-medium">Extended Key Usage:</span>{" "}
                        {result.data.extensions.extendedKeyUsage}
                      </p>
                      <p>
                        <span className="font-medium">Basic Constraints:</span>{" "}
                        {result.data.extensions.basicConstraints}
                      </p>
                      <p>
                        <span className="font-medium">Signature Algorithm:</span>{" "}
                        {result.data.signatureAlgorithm}
                      </p>
                    </div>
                  </div>

                  {/* 4. Extensions */}
                  <div className="w-full md:w-1/2 px-2 mb-4">
                    <h4 className="flex items-center text-lg font-semibold mb-3">
                      <ShieldCheck className="w-5 h-5 mr-2 text-indigo-600" />
                      Extensions
                    </h4>
                    <div className="space-y-2 text-sm text-current">
                      <p>
                        <span className="font-medium">Subject Key Identifier:</span>{" "}
                        {result.data.extensions.subjectKeyIdentifier}
                      </p>
                      <p>
                        <span className="font-medium">Authority Key Identifier:</span>{" "}
                        {result.data.extensions.authorityKeyIdentifier}
                      </p>
                      <p>
                        <span className="font-medium">Authority Info Access:</span>{" "}
                        {result.data.extensions.authorityInfoAccess.split("\n").map((line, idx) => (
                          <span key={idx}>
                            {line}
                            <br />
                          </span>
                        ))}
                      </p>
                      <p>
                        <span className="font-medium">Subject Alternative Name:</span>{" "}
                        {result.data.extensions.subjectAltName}
                      </p>
                      <p>
                        <span className="font-medium">Certificate Policies:</span>{" "}
                        {result.data.extensions.certificatePolicies}
                      </p>
                      <p>
                        <span className="font-medium">CRL Distribution Points:</span>{" "}
                        {result.data.extensions.crlDistributionPoints.split("\n").map((line, idx) => (
                          <span key={idx}>
                            {line}
                            <br />
                          </span>
                        ))}
                      </p>
                      <p>
                        <span className="font-medium">CT Precert SCTs:</span>{" "}
                        {result.data.extensions.ct_precert_scts.split("\n").map((line, idx) => (
                          <span key={idx}>
                            {line}
                            <br />
                          </span>
                        ))}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 5. Public Key Information */}
                <div>
                  <h4 className="flex items-center text-lg font-semibold mb-3">
                    <FileSearch className="w-5 h-5 mr-2 text-indigo-600" />
                    Public Key Information
                  </h4>
                  <div className="space-y-2 text-sm text-current">
                    <p>
                      <span className="font-medium">Public Key:</span>{" "}
                      {result.data.extensions.public_key || "N/A"}
                    </p>
                    {/* Add more public key details if available */}
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
