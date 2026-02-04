'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { DollarSign, UserCheck, TrendingUp, TrendingDown, Loader2, Ticket, ArrowDownCircle } from 'lucide-react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import api from '@/lib/api'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler)

const COLORS = ['#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#3B82F6', '#EF4444']

export default function DashboardTab() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadStats() }, [])

  const loadStats = async () => {
    try {
      const data = await api.getDashboardStats()
      setStats(data)
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  const statCards = [
    { label: 'Toplam Gelir', value: `₺${stats?.totalRevenue?.toLocaleString() || 0}`, icon: DollarSign, color: 'emerald', change: stats?.todayStats?.revenueChange, today: `₺${stats?.todayStats?.todayRevenue?.toLocaleString() || 0}` },
    { label: 'Toplam Gider', value: `₺${stats?.totalExpense?.toLocaleString() || 0}`, icon: ArrowDownCircle, color: 'red' },
    { label: 'Kullanıcılar', value: stats?.totalUsers || 0, icon: UserCheck, color: 'violet', change: stats?.todayStats?.usersChange, today: stats?.todayStats?.todayUsers || 0 },
    { label: 'Açık Talepler', value: stats?.openTickets || 0, icon: Ticket, color: 'amber' },
  ]

  // Gelir Grafiği
  const revenueChartData = {
    labels: stats?.charts?.revenueChart?.map((d: any) => d.date) || [],
    datasets: [{ label: 'Gelir', data: stats?.charts?.revenueChart?.map((d: any) => d.revenue) || [], borderColor: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.1)', fill: true, tension: 0.4 }]
  }

  // Gider Grafiği
  const expenseChartData = {
    labels: stats?.charts?.revenueChart?.map((d: any) => d.date) || [],
    datasets: [{ label: 'Gider', data: stats?.charts?.revenueChart?.map((d: any) => d.expense) || [], borderColor: '#EF4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', fill: true, tension: 0.4 }]
  }

  // Sipariş Grafiği
  const ordersChartData = {
    labels: stats?.charts?.ordersChart?.map((d: any) => d.date) || [],
    datasets: [{ label: 'Siparişler', data: stats?.charts?.ordersChart?.map((d: any) => d.orders) || [], backgroundColor: '#3B82F6', borderRadius: 4 }]
  }

  // Kategori Grafiği
  const categoryChartData = {
    labels: stats?.charts?.categoryChart?.map((d: any) => d.name) || [],
    datasets: [{ data: stats?.charts?.categoryChart?.map((d: any) => d.sales) || [], backgroundColor: COLORS, borderWidth: 0 }]
  }

  const lineChartOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#6b7280', maxRotation: 0, autoSkip: true, maxTicksLimit: 7, font: { size: 10 } } },
      y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#6b7280', font: { size: 10 }, callback: (v: any) => v >= 1000 ? '₺' + (v/1000).toFixed(0) + 'k' : '₺' + v }, beginAtZero: true }
    }
  }

  const barChartOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#6b7280', maxRotation: 0, autoSkip: true, maxTicksLimit: 10, font: { size: 9 } } },
      y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#6b7280', font: { size: 10 }, stepSize: 1 }, beginAtZero: true }
    }
  }

  const doughnutOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, cutout: '60%' }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">Dashboard</h1>
      
      {/* Stat Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-${stat.color}-500/10 flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-400`} />
              </div>
              {stat.change !== undefined && (
                <span className={`text-sm font-medium flex items-center gap-1 ${Number(stat.change) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {Number(stat.change) >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {Math.abs(Number(stat.change))}%
                </span>
              )}
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-gray-500 text-sm">{stat.label}</p>
            {stat.today !== undefined && <p className="text-xs text-gray-600 mt-1">Bugün: {stat.today}</p>}
          </motion.div>
        ))}
      </div>

      {/* Gelir & Gider Grafikleri - Yan Yana */}
      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-emerald-400 mb-3 sm:mb-4">Son 7 Gün Gelir</h2>
          <div className="h-48 sm:h-64"><Line data={revenueChartData} options={lineChartOptions} /></div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-red-400 mb-3 sm:mb-4">Son 7 Gün Gider</h2>
          <div className="h-48 sm:h-64"><Line data={expenseChartData} options={lineChartOptions} /></div>
        </motion.div>
      </div>

      {/* Kategori Satışları & Siparişler - Yan Yana */}
      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-card p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Kategori Satışları</h2>
          <div className="h-48 sm:h-64">
            {stats?.charts?.categoryChart?.length > 0 ? <Doughnut data={categoryChartData} options={doughnutOptions} /> : <div className="flex items-center justify-center h-full text-gray-500">Veri yok</div>}
          </div>
          {stats?.charts?.categoryChart?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3 sm:mt-4">
              {stats.charts.categoryChart.map((cat: any, i: number) => (
                <span key={cat.name} className="flex items-center gap-1.5 text-xs text-gray-400">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />{cat.name}
                </span>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="glass-card p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Son 30 Gün Siparişler</h2>
          <div className="h-48 sm:h-64"><Bar data={ordersChartData} options={barChartOptions} /></div>
        </motion.div>
      </div>
    </div>
  )
}
