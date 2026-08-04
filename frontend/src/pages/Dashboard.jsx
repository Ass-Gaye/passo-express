import { useEffect, useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'

import {
  DollarSign,
  MapPin,
  Car,
  Route
} from 'lucide-react'

import { getFares } from '../services/fares.service'
import { getLocalities } from '../services/localities.service'
import { getVehicleTypes } from '../services/vehicleTypes.service'

const Dashboard = () => {
  const [stats, setStats] = useState({ fareCount: 0, localityCount: 0, vehicleTypeCount: 0 })
  const [farePriceData, setFarePriceData] = useState([])
  const [vehicleDistribution, setVehicleDistribution] = useState([])

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [faresData, localitiesData, vehicleTypesData] = await Promise.all([
          getFares(),
          getLocalities(),
          getVehicleTypes(),
        ])

        const groupedByVehicle = faresData.reduce((acc, fare) => {
          const name = fare.vehicleType?.name || 'Unknown'
          acc[name] = (acc[name] || 0) + 1
          return acc
        }, {})

        const priceByVehicle = faresData.reduce((acc, fare) => {
          const name = fare.vehicleType?.name || 'Unknown'
          if (!acc[name]) acc[name] = []
          acc[name].push(fare.price)
          return acc
        }, {})

        setStats({
          fareCount: faresData?.length || 0,
          localityCount: localitiesData?.length || 0,
          vehicleTypeCount: vehicleTypesData?.length || 0,
        })

        setVehicleDistribution(
          Object.entries(groupedByVehicle).map(([name, value]) => ({ name, value }))
        )

        setFarePriceData(
          Object.entries(priceByVehicle).map(([name, prices]) => ({
            name,
            averagePrice: Math.round(prices.reduce((sum, price) => sum + price, 0) / prices.length),
          }))
        )
      } catch (error) {
        console.error('Failed to load dashboard data', error)
      }
    }

    loadDashboardData()
  }, [])

  return (

    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">

      <div className="max-w-7xl mx-auto">

        {/* PAGE TITLE */}

        <div className="mb-10">

          <h1 className="text-5xl font-bold dark:text-white">
            Dashboard Analytics
          </h1>

          <p className="text-gray-500 mt-3">
            Transport system insights and analytics
          </p>

        </div>


        {/* STATS */}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">

          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow">

            <DollarSign className="mb-4 text-green-500" />

            <h2 className="text-3xl font-bold dark:text-white">
              {stats.fareCount}
            </h2>

            <p className="text-gray-500">
              Active Fare Entries
            </p>

          </div>


          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow">

            <Route className="mb-4 text-blue-500" />

            <h2 className="text-3xl font-bold dark:text-white">
              {stats.fareCount}
            </h2>

            <p className="text-gray-500">
              Active Routes
            </p>

          </div>


          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow">

            <MapPin className="mb-4 text-red-500" />

            <h2 className="text-3xl font-bold dark:text-white">
              {stats.localityCount}
            </h2>

            <p className="text-gray-500">
              Localities
            </p>

          </div>


          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow">

            <Car className="mb-4 text-purple-500" />

            <h2 className="text-3xl font-bold dark:text-white">
              {stats.vehicleTypeCount}
            </h2>

            <p className="text-gray-500">
              Vehicle Types
            </p>

          </div>

        </div>


        {/* CHARTS */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* BAR CHART */}

          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow">

            <h2 className="text-2xl font-bold mb-6 dark:text-white">
              Average Fare by Vehicle Type
            </h2>

            <ResponsiveContainer width="100%" height={300}>

              <BarChart data={farePriceData}>

                <XAxis dataKey="month" />

                <YAxis />

                <Tooltip />

                <Bar
                  dataKey="averagePrice"
                  fill="#2563eb"
                  radius={[8, 8, 0, 0]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>


          {/* PIE CHART */}

          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow">

            <h2 className="text-2xl font-bold mb-6 dark:text-white">
              Fare Distribution by Vehicle Type
            </h2>

            <ResponsiveContainer width="100%" height={300}>

              <PieChart>

                <Pie
                  data={vehicleDistribution}
                  dataKey="value"
                  outerRadius={100}
                  label
                >

                  <Cell fill="#2563eb" />

                  <Cell fill="#16a34a" />

                  <Cell fill="#dc2626" />

                </Pie>

                <Tooltip />

              </PieChart>

            </ResponsiveContainer>

          </div>

        </div>

      </div>

    </div>
  )
}

export default Dashboard