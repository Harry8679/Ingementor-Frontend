import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface ChartProps<T extends object> {
  data: T[];
  type?: 'line' | 'bar';
  dataKey: keyof T;
  xKey: keyof T;
  title: string;
}

const Chart = <T extends object>({
  data,
  type = 'line',
  dataKey,
  xKey,
  title
}: ChartProps<T>) => {
  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white">
      <h3 className="text-2xl font-black text-gray-900 mb-6">{title}</h3>

      <ResponsiveContainer width="100%" height={300}>
        {type === 'line' ? (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey as string} />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey={dataKey as string}
              stroke="#8b5cf6"
              strokeWidth={3}
            />
          </LineChart>
        ) : (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey as string} />
            <YAxis />
            <Tooltip />
            <Bar dataKey={dataKey as string} fill="#8b5cf6" />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;