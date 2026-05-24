import { useEffect, useMemo, useState } from 'react'

import FareCard from '../components/FareCard'

import { getFares } from '../services/fares.service'

import { getVehicleTypes } from '../services/vehicleTypes.service'


const Fares = () => {

  const [fares, setFares] = useState([])

  const [vehicleTypes, setVehicleTypes] = useState([])

  const [search, setSearch] = useState('')

  const [selectedVehicle, setSelectedVehicle] = useState('')

  const [currentPage, setCurrentPage] = useState(1)

  const faresPerPage = 6


  // ======================
  // FETCH DATA
  // ======================

      const fetchData = async () => {

      try {

        const faresData = await getFares()

        const vehicleTypesData = await getVehicleTypes()

        setFares(faresData)

        setVehicleTypes(vehicleTypesData)

      } catch (error) {

        console.error(error)

      }

    }

    useEffect(() => {

      fetchData()

    }, [])


  // ======================
  // FILTERED FARES
  // ======================

  const filteredFares = useMemo(() => {

    return fares.filter((fare) => {

      const route =
        `${fare.fromLocality?.name} ${fare.toLocality?.name}`
          .toLowerCase()

      const matchesSearch =
        route.includes(search.toLowerCase())

      const matchesVehicle =
        selectedVehicle === ''
          ? true
          : fare.vehicleTypeId === Number(selectedVehicle)

      return matchesSearch && matchesVehicle

    })

  }, [fares, search, selectedVehicle])


  // ======================
  // PAGINATION
  // ======================

  const totalPages = Math.ceil(
    filteredFares.length / faresPerPage
  )

  const startIndex =
    (currentPage - 1) * faresPerPage

  const currentFares =
    filteredFares.slice(
      startIndex,
      startIndex + faresPerPage
    )


  // ======================
  // PAGE CHANGE
  // ======================

  const goToPage = (page) => {

    setCurrentPage(page)

  }


  // ======================
  // RESET PAGE WHEN FILTER CHANGES
  // ======================

  useEffect(() => {

    setCurrentPage(1)

  }, [search, selectedVehicle])


  return (

    <div className="min-h-screen bg-gray-50 p-6">

      {/* ======================
          PAGE HEADER
      ====================== */}

      <div className="max-w-7xl mx-auto">

        <div className="mb-10">

          <h1 className="text-5xl font-bold">
            Transport Fares
          </h1>

          <p className="text-gray-600 mt-3">
            Browse and search transport fares across The Gambia
          </p>

        </div>


        {/* ======================
            SEARCH & FILTER
        ====================== */}

        <div className="bg-white rounded-2xl shadow-sm p-6 mb-10">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* SEARCH */}

            <input
              type="text"
              placeholder="Search route..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border p-4 rounded-lg w-full"
            />


            {/* FILTER */}

            <select
              value={selectedVehicle}
              onChange={(e) => setSelectedVehicle(e.target.value)}
              className="border p-4 rounded-lg w-full"
            >

              <option value="">
                All Vehicle Types
              </option>

              {vehicleTypes.map((vehicle) => (

                <option
                  key={vehicle.id}
                  value={vehicle.id}
                >
                  {vehicle.name}
                </option>

              ))}

            </select>

          </div>

        </div>


        {/* ======================
            RESULTS COUNT
        ====================== */}

        <div className="mb-6">

          <p className="text-gray-600">

            Showing

            <span className="font-bold mx-2">
              {filteredFares.length}
            </span>

            fares

          </p>

        </div>


        {/* ======================
            FARES GRID
        ====================== */}

        {currentFares.length > 0 ? (

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {currentFares.map((fare) => (

              <FareCard
                key={fare.id}
                fare={fare}
                refreshFares={fetchData}
              />

            ))}

          </div>

        ) : (

          <div className="bg-white rounded-2xl p-10 text-center">

            <h2 className="text-2xl font-bold">
              No fares found
            </h2>

            <p className="text-gray-500 mt-2">
              Try changing your search or filters
            </p>

          </div>

        )}


        {/* ======================
            PAGINATION
        ====================== */}

        {totalPages > 1 && (

          <div className="flex justify-center mt-12 gap-2 flex-wrap">

            {Array.from(
              { length: totalPages },
              (_, index) => index + 1
            ).map((page) => (

              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`
                  px-5 py-3 rounded-lg border
                  ${currentPage === page
                    ? 'bg-black text-white'
                    : 'bg-white'}
                `}
              >
                {page}
              </button>

            ))}

          </div>

        )}

      </div>

    </div>
  )
}

export default Fares