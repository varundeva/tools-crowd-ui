"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function NSLookup() {
  const [domain, setDomain] = useState("");
  const [result, setResult] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/nslookup?domain=${domain}`);
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult("Error occurred while fetching data");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        value={domain}
        onChange={(e) => setDomain(e.target.value)}
        placeholder="Enter a domain name"
        required
      />
      <Button type="submit" className="w-full">
        Lookup
      </Button>
      {result && (
        <Textarea value={result} readOnly className="mt-4 h-[200px]" />
      )}
    </form>
  );
}
