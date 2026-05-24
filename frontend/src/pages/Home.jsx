import { Link } from 'react-router-dom'
import MapView from '../components/MapView'

const Home = () => {

  return (

    <div className="min-h-screen bg-gray-50">

      {/* ================= HERO SECTION ================= */}

      <section className="bg-black text-white">

        <div className="max-w-7xl mx-auto px-6 py-24">

          <div className="max-w-3xl">

            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Smart Transport Fare System For The Gambia
            </h1>

            <p className="mt-6 text-lg text-gray-300 leading-relaxed">
              PASSO Express helps commuters easily check transport fares,
              compare vehicle types, and explore routes across The Gambia.
            </p>


            <div className="flex gap-4 mt-8 flex-wrap">

              <Link
                to="/fares"
                className="bg-white text-black px-6 py-4 rounded-lg font-semibold hover:bg-gray-200 transition"
              >
                View Fares
              </Link>


              <Link
                to="/create-fare"
                className="border border-white px-6 py-4 rounded-lg font-semibold hover:bg-white hover:text-black transition"
              >
                Add Fare
              </Link>

            </div>

          </div>

        </div>

      </section>


      {/* ================= STATS ================= */}

      <section className="max-w-7xl mx-auto px-6 py-20">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-white p-8 rounded-2xl shadow-sm">

            <h2 className="text-4xl font-bold">
              50+
            </h2>

            <p className="text-gray-600 mt-2">
              Available Routes
            </p>

          </div>


          <div className="bg-white p-8 rounded-2xl shadow-sm">

            <h2 className="text-4xl font-bold">
              10+
            </h2>

            <p className="text-gray-600 mt-2">
              Vehicle Types
            </p>

          </div>


          <div className="bg-white p-8 rounded-2xl shadow-sm">

            <h2 className="text-4xl font-bold">
              1000+
            </h2>

            <p className="text-gray-600 mt-2">
              Daily Users
            </p>

          </div>

        </div>

      </section>


      {/* ================= POPULAR ROUTES ================= */}

      <section className="max-w-7xl mx-auto px-6 py-10">

        <div className="flex items-center justify-between mb-8">

          <div>

            <h2 className="text-4xl font-bold">
              Popular Routes
            </h2>

            <p className="text-gray-600 mt-2">
              Commonly searched transport routes
            </p>

          </div>

        </div>


        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-white rounded-2xl p-6 shadow-sm">

            <h3 className="text-2xl font-semibold">
              Serekunda → Banjul
            </h3>

            <p className="mt-3 text-gray-600">
              Fastest and busiest route in the country.
            </p>

          </div>


          <div className="bg-white rounded-2xl p-6 shadow-sm">

            <h3 className="text-2xl font-semibold">
              Brikama → Serekunda
            </h3>

            <p className="mt-3 text-gray-600">
              Daily commercial transport route.
            </p>

          </div>


          <div className="bg-white rounded-2xl p-6 shadow-sm">

            <h3 className="text-2xl font-semibold">
              Bakau → Banjul
            </h3>

            <p className="mt-3 text-gray-600">
              Affordable urban commuting route.
            </p>

          </div>

        </div>

      </section>


      {/* ================= FEATURES ================= */}

      <section className="max-w-7xl mx-auto px-6 py-20">

        <div className="text-center mb-14">

          <h2 className="text-5xl font-bold">
            Why PASSO Express?
          </h2>

          <p className="text-gray-600 mt-4">
            A smarter way to manage transport fare information
          </p>

        </div>


        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          <div className="bg-white p-8 rounded-2xl shadow-sm">

            <h3 className="text-2xl font-bold">
              Real-Time Fare Access
            </h3>

            <p className="text-gray-600 mt-4">
              Instantly view transport fares between localities.
            </p>

          </div>


          <div className="bg-white p-8 rounded-2xl shadow-sm">

            <h3 className="text-2xl font-bold">
              Multiple Vehicle Types
            </h3>

            <p className="text-gray-600 mt-4">
              Compare fares across taxis, buses, and gele-gele.
            </p>

          </div>


          <div className="bg-white p-8 rounded-2xl shadow-sm">

            <h3 className="text-2xl font-bold">
              Simple & Fast
            </h3>

            <p className="text-gray-600 mt-4">
              Clean experience designed for everyday commuters.
            </p>

          </div>

        </div>

      </section>




    {/* ================= MAP SECTION ================= */}

        <section className="max-w-7xl mx-auto px-6 py-20">

        <div className="mb-10">

            <h2 className="text-5xl font-bold">
            Transport Coverage Map
            </h2>

            <p className="text-gray-600 mt-4">
            Explore major transport locations across The Gambia
            </p>

        </div>

        <MapView />

        </section>



      {/* ================= CTA ================= */}

      <section className="bg-black text-white mt-20">

        <div className="max-w-7xl mx-auto px-6 py-24 text-center">

          <h2 className="text-5xl font-bold">
            Start Exploring Transport Fares
          </h2>

          <p className="text-gray-300 mt-6 text-lg">
            Discover routes, compare prices, and simplify your commute.
          </p>


          <Link
            to="/fares"
            className="inline-block mt-8 bg-white text-black px-8 py-4 rounded-lg font-semibold hover:bg-gray-200 transition"
          >
            Explore Fares
          </Link>

        </div>

      </section>

    </div>
  )
}

export default Home