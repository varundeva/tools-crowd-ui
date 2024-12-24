/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Tool {
  id: string;
  title: string;
  description: string;
  information: string;
  useCases: string[];
  component: React.ComponentType<any>;
}

export interface Category {
  id: string;
  name: string;
  tools: Tool[];
}

import NSLookup from "@/components/NSLookup";
import DomainToIP from "@/components/DomainToIP";
import Base64Tool from "@/components/Base64Tool";
import WHOISTool from "@/components/WHOIStool";
import DNSTool from "@/components/DNSTool";
import SSLTool from "@/components/SSLTool";
import EmailSecurityTool from "@/components/EmailSecurityTool";
import HTTPHeaderTool from "@/components/HTTPHeaderTool";
import PDFCompressTool from "@/components/PDFCompressTool";

export const categories: Category[] = [
  {
    id: "dns-tools",
    name: "DNS Tools",
    tools: [
      {
        id: "nslookup",
        title: "NS Lookup",
        description: "Look up name server information for a domain",
        information:
          "NS Lookup (Name Server Lookup) is a network administration tool used to query the Domain Name System (DNS) to obtain domain name or IP address mapping information. It helps in diagnosing DNS-related problems and verifying DNS records.",
        useCases: [
          "Troubleshooting email delivery issues",
          "Verifying DNS changes have propagated",
          "Identifying authoritative name servers for a domain",
          "Debugging network connectivity problems",
        ],
        component: NSLookup,
      },
      {
        id: "domain-to-ip",
        title: "Domain to IP",
        description: "Convert a domain name to IP address",
        information:
          "The Domain to IP tool resolves a domain name to its corresponding IP address(es). This process is fundamental to how the internet works, allowing human-readable domain names to be translated into machine-readable IP addresses that computers use to identify each other on a network.",
        useCases: [
          "Troubleshooting network connectivity issues",
          "Verifying server configurations",
          "Setting up firewall rules",
          "Bypassing DNS-based content filters",
        ],
        component: DomainToIP,
      },
      {
        id: "whois",
        title: "WHOIS Infomation",
        description: "Check Whois information of a domain",
        information:
          "The Whois tool acts as a public directory for domain names, providing crucial information about their registration and ownership. This information is essential for various purposes, from resolving domain-related issues to conducting online research.",
        useCases: [
          "Understand domain ownership and relationships.",
          "Troubleshoot domain-related issues.",
          "Conduct security research",
          "Make informed decisions about online interactions.",
        ],
        component: WHOISTool,
      },
      {
        id: "dns",
        title: "DNS Information",
        description: "Check DNS records of a domain",
        information:
          "The DNS (Domain Name System) tool enables users to query and analyze the DNS records associated with a specific domain. DNS records are fundamental for the operation of the internet, translating human-readable domain names into machine-readable IP addresses. This tool is invaluable for understanding how a domain is configured, ensuring its proper functionality, and diagnosing related issues.",
        useCases: [
          "Identify the IP address associated with a domain.",
          "Determine the authoritative nameservers for a domain.",
          "Inspect email server configurations via MX records.",
          "Verify domain security through DNSSEC records.",
          "Troubleshoot connectivity and performance issues.",
          "Analyze DNS propagation and updates."
        ],
        component: DNSTool,
      },
      {
        id: "ssl",
        title: "SSL Certificate Information",
        description: "Check SSL certificate details of a domain",
        information:
          "The SSL Certificate tool allows users to inspect the SSL/TLS certificates associated with a domain. Understanding SSL certificate details is crucial for ensuring secure communications, verifying the authenticity of websites, and maintaining trust in online transactions. This tool provides comprehensive insights into certificate attributes, issuer information, validity periods, and security configurations, enabling users to assess and manage their domain's security posture effectively.",
        useCases: [
          "Verify the issuer and validity period of an SSL certificate.",
          "Ensure that the SSL certificate is properly configured.",
          "Detect potential security issues related to SSL/TLS.",
          "Assess the strength of encryption algorithms used.",
          "Monitor certificate expiration to prevent downtime.",
          "Analyze certificate chain and trustworthiness."
        ],
        component: SSLTool,
      },
      {
        id: "email-security",
        title: "Email Security Information",
        description: "Check Email Security records of a domain",
        information:
          "The Email Security tool allows users to inspect the email authentication records (SPF, DKIM, DMARC) associated with a domain. These records are crucial for verifying the legitimacy of email senders, preventing email spoofing, and ensuring secure email communications. This tool provides comprehensive insights into how a domain handles email authentication, aiding in the enhancement of email security measures.",
        useCases: [
          "Verify the SPF record to ensure authorized mail servers.",
          "Check DKIM records for email integrity and authenticity.",
          "Assess DMARC policies to enforce email handling strategies.",
          "Prevent email spoofing and phishing attacks.",
          "Improve email deliverability and reduce spam.",
          "Diagnose and troubleshoot email authentication issues.",
        ],
        component: EmailSecurityTool,
      },
      {
        id: "http-headers",
        title: "HTTP Headers Information",
        description: "Check HTTP headers of a domain",
        information:
          "The HTTP Headers tool allows users to inspect the HTTP response headers of a domain. HTTP headers provide essential information about the server's response, security configurations, content type, caching policies, and more. This tool is invaluable for developers, security analysts, and IT professionals to understand how a domain is configured and to troubleshoot related issues.",
        useCases: [
          "Analyze server configurations and technologies.",
          "Inspect caching policies and content delivery strategies.",
          "Evaluate security headers for vulnerabilities.",
          "Monitor HTTP response codes and redirects.",
          "Understand content types and character encoding.",
          "Diagnose issues related to HTTP requests and responses.",
        ],
        component: HTTPHeaderTool,
      },
      
    ],
  },
  {
    id: "encoding-tools",
    name: "Encoding/Decoding Tools",
    tools: [
      {
        id: "base64",
        title: "Base64 Encoder/Decoder",
        description: "Encode or decode Base64 strings",
        information:
          "Base64 is a binary-to-text encoding scheme that represents binary data in an ASCII string format. It's designed to carry data stored in binary formats across channels that only reliably support text content. Base64 is commonly used when there's a need to encode binary data that needs to be stored and transferred over media that are designed to deal with textual data.",
        useCases: [
          "Encoding binary data for inclusion in XML or JSON",
          "Embedding image data in CSS or HTML",
          "Encoding data in URL parameters",
          "Storing complex data structures in text-based databases",
        ],
        component: Base64Tool,
      },
    ],
  },


  {
    id: "pdf-tools",
    name: "Encoding/Decoding Tools",
    tools: [
    {
      id: "pdf-compress",
      title: "PDF Compress Tool",
      description: "Compress PDF files to reduce their size",
      information:
        "The PDF Compress Tool allows users to reduce the size of their PDF documents without compromising on quality. This tool is essential for optimizing files for web uploads, email attachments, and storage management. By compressing PDFs, users can save bandwidth, enhance loading times, and ensure smoother sharing and distribution of documents.",
      useCases: [
        "Optimize PDF files for faster web loading.",
        "Reduce file size for email attachments.",
        "Manage storage by minimizing document sizes.",
        "Prepare documents for online sharing and distribution.",
        "Enhance user experience by decreasing download times.",
        "Ensure compliance with file size restrictions on various platforms.",
      ],
      component: PDFCompressTool, // Ensure this references PDFCompressTool correctly
    },]
  }
];
