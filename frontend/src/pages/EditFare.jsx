import {
  useEffect,
  useState
} from 'react'

import {
  useNavigate,
  useParams
} from 'react-router-dom'

import {
  getFare,
  updateFare
} from '../services/fares.service'

import { getLocalities } from '../services/localities.service'

import { getVehicleTypes } from '../services/vehicleTypes.service'


const EditFare = () => {

  const { id } = useParams()

  const navigate = useNavigate()


  const [localities, setLocalities] = useState([])

  const [vehicleTypes, setVehicleTypes] = useState([])


  const [formData, setFormData] = useState({
    fromLocalityId: '',
    toLocalityId: '',
    vehicleTypeId: '',
    price: '',
    reason: ''
  })


  useEffect(() => {

    const fetchData = async () => {

      try {

        const fare = await getFare(id)

        const localitiesData =
          await getLocalities()

        const vehicleTypesData =
          await getVehicleTypes()

        setLocalities(localitiesData)

        setVehicleTypes(vehicleTypesData)

        setFormData({
          fromLocalityId: fare.fromLocalityId,
          toLocalityId: fare.toLocalityId,
          vehicleTypeId: fare.vehicleTypeId,
          price: fare.price
        })

      } catch (error) {

        console.error(error)
      }
    }

    fetchData()

  }, [id])


  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }


  const handleSubmit = async (e) => {

    e.preventDefault()

    try {

      await updateFare(id, {
        fromLocalityId: Number(formData.fromLocalityId),
        toLocalityId: Number(formData.toLocalityId),
        vehicleTypeId: Number(formData.vehicleTypeId),
        price: Number(formData.price),
        reason: formData.reason,
      })

      alert('Fare updated successfully')

      navigate('/fares')

    } catch (error) {

      console.error(error)

      alert('Failed to update fare')
    }
  }


  return (

    <div className="p-6 max-w-xl mx-auto">

      <h1 className="text-4xl font-bold mb-8">
        Edit Fare
      </h1>


      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >

        <select
          name="fromLocalityId"
          value={formData.fromLocalityId}
          onChange={handleChange}
          className="border w-full p-3 rounded"
        >

          {localities.map((locality) => (

            <option
              key={locality.id}
              value={locality.id}
            >
              {locality.name}
            </option>

          ))}

        </select>


        <select
          name="toLocalityId"
          value={formData.toLocalityId}
          onChange={handleChange}
          className="border w-full p-3 rounded"
        >

          {localities.map((locality) => (

            <option
              key={locality.id}
              value={locality.id}
            >
              {locality.name}
            </option>

          ))}

        </select>


        <select
          name="vehicleTypeId"
          value={formData.vehicleTypeId}
          onChange={handleChange}
          className="border w-full p-3 rounded"
        >

          {vehicleTypes.map((vehicle) => (

            <option
              key={vehicle.id}
              value={vehicle.id}
            >
              {vehicle.name}
            </option>

          ))}

        </select>


        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          className="border w-full p-3 rounded"
        />

        <textarea
          name="reason"
          value={formData.reason}
          onChange={handleChange}
          placeholder="Reason for fare update (optional)"
          className="border w-full p-3 rounded h-24"
        />

        <button
          className="
            bg-black text-white
            px-6 py-3 rounded-lg
            w-full
          "
        >
          Update Fare
        </button>

      </form>

    </div>
  )
}

export default EditFare