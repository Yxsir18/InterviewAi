import { motion } from 'framer-motion';

const SkillAnalysis = ({ skills }) => {
  const skillLevels = skills.slice(0, 5).map((skill, index) => ({
    name: skill,
    level: Math.max(60, 100 - index * 10),
  }));

  if (skills.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">Upload your resume to see skill analysis</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {skillLevels.map((skill, index) => (
        <motion.div
          key={skill.name}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">{skill.name}</span>
            <span className="text-sm text-gray-400">{skill.level}%</span>
          </div>
          <div className="h-2 bg-dark-600 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${skill.level}%` }}
              transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
              className="h-full bg-gradient-to-r from-primary-500 to-blue-500 rounded-full"
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default SkillAnalysis;
