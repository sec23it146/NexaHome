import { motion } from "framer-motion";

const MetricCard = ({ label, value, icon: Icon, tone = "blue" }) => (
  <motion.div className={`metric metric-${tone}`} whileHover={{ y: -5, scale: 1.01 }}>
    <div>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
    {Icon && <Icon size={24} />}
  </motion.div>
);

export default MetricCard;
