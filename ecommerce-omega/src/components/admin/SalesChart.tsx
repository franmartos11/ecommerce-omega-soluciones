"use client";

import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Order = {
  created_at: string;
  total: number | string;
  status: string;
};

interface SalesChartProps {
  orders: Order[];
  days?: number;
}

export function SalesChart({ orders, days = 14 }: SalesChartProps) {
  const chartData = useMemo(() => {
    // 1. Array of the last N days (e.g., last 14 days)
    const dates = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      dates.push(d);
    }

    // 2. Filter valid orders (don't count 'cancelado')
    const validOrders = orders.filter(o => o.status !== "cancelado");

    // 3. Map orders into days and sum revenue
    const data = dates.map(date => {
      const dateString = date.toISOString().split("T")[0]; // YYYY-MM-DD
      
      const dayOrders = validOrders.filter(o => {
        if (!o.created_at) return false;
        const orderDate = new Date(o.created_at);
        return orderDate.toISOString().split("T")[0] === dateString;
      });

      const dailyRevenue = dayOrders.reduce((acc, order) => {
        const val = typeof order.total === "number" ? order.total : parseFloat(order.total || "0");
        return acc + val;
      }, 0);

      const formattedLabel = date.toLocaleDateString("es-AR", { day: '2-digit', month: 'short' });

      return {
        date: formattedLabel,
        rawDate: date,
        Ingresos: dailyRevenue,
      };
    });

    return data;
  }, [orders, days]);

  // Custom Formatter for the Tooltip
  type TooltipPayload = { value: number };
  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: TooltipPayload[]; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 p-3 rounded-lg shadow-lg">
          <p className="text-gray-500 font-medium text-xs mb-1">{label}</p>
          <p className="text-blue-600 font-bold text-lg">
            ${payload[0].value.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col">
      <div className="mb-6">
        <h2 className="font-bold text-gray-900 text-lg">Ingresos a lo Largo del Tiempo</h2>
        <p className="text-sm text-gray-500">Últimos {days} días (órdenes exitosas/pendientes)</p>
      </div>

      <div className="flex-1 min-h-[250px] md:min-h-[300px]">
        {chartData.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            No hay datos para mostrar
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#6b7280', fontSize: 12 }} 
                dy={10} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#6b7280', fontSize: 12 }} 
                tickFormatter={(value) => `$${value}`} 
                width={80}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="Ingresos" 
                stroke="#2563eb" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorIngresos)" 
                activeDot={{ r: 6, strokeWidth: 0, fill: '#2563eb' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
