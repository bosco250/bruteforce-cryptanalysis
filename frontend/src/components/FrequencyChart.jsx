import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'framer-motion';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-secondary border border-accent rounded-lg p-3 shadow-xl">
        <p className="text-gray-200 font-semibold">{payload[0].payload.shift}</p>
        <p className="text-accent text-sm">
          Match: <span className="font-bold">{payload[0].value}%</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function FrequencyChart({ results }) {
  // Get top 10 results for visualization
  const topResults = results.slice(0, 10);
  
  const chartData = topResults.map((result, index) => ({
    shift: `Option ${index + 1}`,
    score: parseFloat((result.score * 100).toFixed(2)),
    rank: index + 1,
    fill: index === 0 ? '#a78bfa' : '#22d3ee'
  }));

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="card p-6 md:p-8"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-accent flex items-center gap-2">
          <span>📊</span>
          Confidence Scores
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          How likely each decoded message is correct
        </p>
      </div>
      
      <div className="w-full h-80 md:h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity={1} />
                <stop offset="100%" stopColor="#a78bfa" stopOpacity={0.8} />
              </linearGradient>
              <linearGradient id="bestGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a78bfa" stopOpacity={1} />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.9} />
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
            
            <XAxis 
              dataKey="shift" 
              stroke="#94a3b8"
              style={{ fontSize: '11px' }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            
            <YAxis 
              stroke="#94a3b8"
              style={{ fontSize: '12px' }}
              label={{ 
                value: 'Match Confidence (%)', 
                angle: -90, 
                position: 'insideLeft', 
                fill: '#94a3b8',
                style: { fontSize: '12px' }
              }}
              domain={[0, 100]}
            />
            
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(34, 211, 238, 0.1)' }} />
            
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="circle"
              formatter={(value) => <span className="text-gray-300 text-sm">{value}</span>}
            />
            
            <Bar 
              dataKey="score" 
              fill="url(#colorGradient)"
              radius={[8, 8, 0, 0]}
              name="Match Score"
              animationDuration={800}
            >
              {chartData.map((entry, index) => (
                <motion.rect
                  key={`bar-${index}`}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-primary/50 rounded-lg p-4 border border-accent/10">
          <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Best Match</p>
          <p className="text-2xl font-bold text-success">
            {chartData[0]?.score.toFixed(2)}%
          </p>
        </div>
        
        <div className="bg-primary/50 rounded-lg p-4 border border-accent/10">
          <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Average</p>
          <p className="text-2xl font-bold text-accent">
            {(chartData.reduce((sum, d) => sum + d.score, 0) / chartData.length).toFixed(2)}%
          </p>
        </div>
        
        <div className="bg-primary/50 rounded-lg p-4 border border-accent/10">
          <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Options Tested</p>
          <p className="text-2xl font-bold text-highlight">
            {results.length}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
