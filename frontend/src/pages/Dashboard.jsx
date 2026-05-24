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


const Dashboard = () => {

  const revenueData = [
    { month: 'Jan', revenue: 4000 },
    { month: 'Feb', revenue: 3000 },
    { month: 'Mar', revenue: 5000 },
    { month: 'Apr', revenue: 4500 },
    { month: 'May', revenue: 6000 },
  ]


  const routeData = [
    { name: 'Taxi', value: 40 },
    { name: 'Bus', value: 35 },
    { name: 'Van', value: 25 },
  ]


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
              D25,000
            </h2>

            <p className="text-gray-500">
              Total Revenue
            </p>

          </div>


          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow">

            <Route className="mb-4 text-blue-500" />

            <h2 className="text-3xl font-bold dark:text-white">
              120
            </h2>

            <p className="text-gray-500">
              Active Routes
            </p>

          </div>


          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow">

            <MapPin className="mb-4 text-red-500" />

            <h2 className="text-3xl font-bold dark:text-white">
              32
            </h2>

            <p className="text-gray-500">
              Localities
            </p>

          </div>


          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow">

            <Car className="mb-4 text-purple-500" />

            <h2 className="text-3xl font-bold dark:text-white">
              85
            </h2>

            <p className="text-gray-500">
              Vehicles
            </p>

          </div>

        </div>


        {/* CHARTS */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* BAR CHART */}

          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow">

            <h2 className="text-2xl font-bold mb-6 dark:text-white">
              Revenue Overview
            </h2>

            <ResponsiveContainer width="100%" height={300}>

              <BarChart data={revenueData}>

                <XAxis dataKey="month" />

                <YAxis />

                <Tooltip />

                <Bar
                  dataKey="revenue"
                  fill="#2563eb"
                  radius={[8, 8, 0, 0]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>


          {/* PIE CHART */}

          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow">

            <h2 className="text-2xl font-bold mb-6 dark:text-white">
              Vehicle Distribution
            </h2>

            <ResponsiveContainer width="100%" height={300}>

              <PieChart>

                <Pie
                  data={routeData}
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