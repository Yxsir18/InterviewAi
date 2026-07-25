import { motion } from 'framer-motion';

export const EnterpriseCard = ({ children, className = '', hover = false, onClick }) => {
  return (
    <motion.div
      whileHover={hover ? { y: -2, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' } : {}}
      className={`enterprise-card ${className} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

export const EnterpriseStatCard = ({
  label,
  value,
  icon: Icon,
  color = 'primary',
  trend,
  trendUp = true,
  sparkline,
  onClick,
}) => {
  const colorClasses = {
    primary: 'from-blue-500/20 to-cyan-500/20 text-blue-400',
    success: 'from-green-500/20 to-emerald-500/20 text-green-400',
    warning: 'from-yellow-500/20 to-orange-500/20 text-yellow-400',
    danger: 'from-red-500/20 to-rose-500/20 text-red-400',
  };

  return (
    <EnterpriseCard hover={!!onClick} onClick={onClick} className="p-4 sm:p-6 h-full w-full">
      <div className="flex flex-col h-full">
        <div className="flex items-start justify-between mb-3 sm:mb-4">
          <div className={`p-2 sm:p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex-shrink-0`}>
            <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          {trend && (
            <div className={`flex items-center text-xs sm:text-sm font-medium whitespace-nowrap ${
              trendUp ? 'text-green-400' : 'text-red-400'
            }`}>
              {trendUp ? '↑' : '↓'} {trend}
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <p className="text-gray-400 text-xs sm:text-sm mb-1">{label}</p>
          <p className="text-xl sm:text-2xl font-bold text-white">{value}</p>
        </div>
        
        {sparkline && (
          <div className="mt-3 sm:mt-4 h-10 sm:h-12 w-full">
            <svg viewBox="0 0 100 40" className="w-full h-full" preserveAspectRatio="none">
              <polyline
                fill="none"
                stroke={color === 'primary' ? '#3B82F6' : color === 'success' ? '#22C55E' : color === 'warning' ? '#F59E0B' : '#EF4444'}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={sparkline.map((val, i) => `${i * 10},${40 - val}`).join(' ')}
              />
            </svg>
          </div>
        )}
      </div>
    </EnterpriseCard>
  );
};

export default EnterpriseCard;
