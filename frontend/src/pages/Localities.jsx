import {
  useEffect,
  useState
} from 'react'

import { getLocalities } from '../services/localities.service'


const Localities = () => {

  const [localities, setLocalities] = useState([])


  useEffect(() => {

    const fetchLocalities = async () => {

      try {

        const data =
          await getLocalities()

        setLocalities(data)

      } catch (error) {

        console.error(error)
      }
    }

    fetchLocalities()

  }, [])


  return (

    <div className="min-h-screen bg-gray-50 p-6">

      <div className="max-w-7xl mx-auto">

        <h1 className="text-5xl font-bold mb-10">
          Localities
        </h1>


        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {localities.map((locality) => (

            <div
              key={locality.id}
              className="
                bg-white
                rounded-2xl
                p-6
                shadow-sm
              "
            >

              <h2 className="text-2xl font-bold">
                {locality.name}
              </h2>

            </div>

          ))}

        </div>

      </div>

    </div>
  )
}

export default Localities