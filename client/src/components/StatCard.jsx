import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon, color, trend }) => {
  const colorClasses = {
    primary: 'from-primary-500 to-primary-600',
    green: 'from-green-500 to-green-600',
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="glass-card p-4 sm:p-6 relative overflow-hidden w-full"
    >
      <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br opacity-10 rounded-full blur-2xl"
        style={{ background: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }}
      ></div>
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3 sm:mb-4">
          <div className={`p-2 sm:p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} bg-opacity-20`}>
            {icon}
          </div>
          {trend && (
            <span className="text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded-full whitespace-nowrap">
              {trend}
            </span>
          )}
        </div>
        
        <h3 className="text-gray-400 text-xs sm:text-sm mb-1">{title}</h3>
        <p className="text-xl sm:text-2xl font-bold">{value}</p>
      </div>
    </motion.div>
  );
};

export default StatCard;
