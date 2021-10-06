import { FaRedo } from "react-icons/fa";
import { motion } from "framer-motion";

const variants = {
  initial: {
    opacity: 0,
    rotate: 0,
  },
  animate: {
    opacity: 1,
    rotate: 360,
  },
  exit: {
    opacity: 0,
    rotate: 0,
  },
};

export const Loading = ({ size }: { size: number }) => (
  <motion.div
    variants={variants}
    transition={{ duration: 0.25, repeat: Infinity }}
    exit="exit"
    initial="initial"
    animate="animate"
  >
    <FaRedo size={size} />
  </motion.div>
);
