import { addScript } from '@/shared/utils/addScript'
import dashboard from './dashboard.html?raw'
import { Chart } from 'frappe-charts'

export const AppDashboard = () => {
  addScript(() => {
    /**
 * Konfigurasi Frappe Charts untuk Dashboard Keuangan
 */

    // 1. Data Tren (Line Chart)
    const trendData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'],
      datasets: [
        {
          name: 'Income',
          type: 'line',
          values: [8500, 9200, 8800, 10500, 11000, 10200],
        },
        {
          name: 'Outcome',
          type: 'line',
          values: [6000, 6500, 7200, 6800, 8000, 7500],
        },
      ],
    }

    const lineChart = new Chart('#chart-trend', {
      title: 'Income vs Outcome',
      data: trendData,
      type: 'axis-mixed',
      height: 320,
      colors: ['#10b981', '#f43f5e'], // Emerald-500 & Rose-500
      lineOptions: {
        regionFill: 1, // Memberikan bayangan halus di bawah garis
        hideDots: 0,
      },
      axisOptions: {
        xIsSeries: true, // Memastikan label bulan berurutan
      },
    })

    // 2. Data Income Pie (Berdasarkan Tags)
    const incomePieData = {
      labels: ['Salary', 'Side Hustle', 'Investment', 'Referral'],
      datasets: [
        {
          values: [7000, 2000, 800, 400],
        },
      ],
    }

    const incomePie = new Chart('#chart-income-pie', {
      data: incomePieData,
      type: 'pie',
      height: 280,
      colors: ['#065f46', '#059669', '#34d399', '#a7f3d0'],
    })

    // 3. Data Outcome Pie (Berdasarkan Tags)
    const outcomePieData = {
      labels: ['Rent', 'Groceries', 'Tech/SaaS', 'Entertainment'],
      datasets: [
        {
          values: [3000, 1500, 1200, 800],
        },
      ],
    }

    const outcomePie = new Chart('#chart-outcome-pie', {
      data: outcomePieData,
      type: 'pie',
      height: 280,
      colors: ['#9f1239', '#e11d48', '#fb7185', '#fff1f2'],
    })
  })
  return dashboard
}