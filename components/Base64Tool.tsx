"use client";

import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Base64Tool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState("encode");
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setInput("");
    setOutput("");
    setError(null);
  }, [mode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);
    setOutput("");

    setTimeout(() => {
      try {
        if (mode === "encode") {
          setOutput(btoa(input));
        } else {
          setOutput(atob(input));
        }
      } catch (err) {
        if (err instanceof Error) {
          setError("Invalid Base64 input");
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setIsProcessing(false);
      }
    }, 500); // Simulate processing delay
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="input">Input</Label>
          <Textarea
            id="input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text to encode or decode"
            required
          />
        </div>
        <RadioGroup
          defaultValue="encode"
          onValueChange={(value) => setMode(value)}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="encode" id="encode" />
            <Label htmlFor="encode">Encode</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="decode" id="decode" />
            <Label htmlFor="decode">Decode</Label>
          </div>
        </RadioGroup>
        <Button type="submit" className="w-full" disabled={isProcessing}>
          {isProcessing ? (mode === "encode" ? "Encoding..." : "Decoding...") : (mode === "encode" ? "Encode" : "Decode")}
        </Button>
      </form>

      {error && (
        <AnimatePresence>
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
        </AnimatePresence>
      )}

      <AnimatePresence>
        {output && !error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-primary text-primary-foreground p-4">
                  <h3 className="text-lg font-semibold">
                    {mode === "encode" ? "Encoded" : "Decoded"} Output
                  </h3>
                </div>
                <div className="p-4">
                  <Textarea value={output} readOnly />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
