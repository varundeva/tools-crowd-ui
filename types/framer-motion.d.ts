import { motion } from "framer-motion";

declare module "framer-motion" {
  export interface AnimatePresenceProps {
    children: React.ReactNode;
  }
}
