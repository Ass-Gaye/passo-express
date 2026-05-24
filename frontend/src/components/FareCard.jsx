import { Link } from 'react-router-dom'

import { motion } from 'framer-motion'

import { Trash2, Pencil } from 'lucide-react'

import { deleteFare } from '../services/fares.service'


const FareCard = ({ fare, refreshFares }) => {

  const handleDelete = async () => {

    const confirmed = window.confirm(
      'Delete this fare?'
    )

    if (!confirmed) return

    try {

      await deleteFare(fare.id)

      refreshFares()

    } catch (error) {

      console.error(error)

      alert('Failed to delete fare')
    }
  }


  return (

    <motion.div

      whileHover={{
        scale: 1.03
      }}

      className="
        bg-white
        dark:bg-gray-800
        rounded-2xl
        p-6
        shadow-sm
        hover:shadow-xl
        transition
      "
    >

      <h2 className="text-2xl font-bold dark:text-white">

        {fare.fromLocality?.name}

        <span className="mx-2">
          →
        </span>

        {fare.toLocality?.name}

      </h2>


      <p className="mt-4 text-gray-600 dark:text-gray-300">

        {fare.vehicleType?.name}

      </p>


      <p className="font-bold mt-2 dark:text-white">

        D{fare.price}

      </p>


      {/* ACTION BUTTONS */}

      <div className="flex gap-3 mt-6">

        <Link
          to={`/edit-fare/${fare.id}`}
          className="
            flex items-center gap-2
            bg-blue-600 text-white
            px-4 py-2 rounded-lg
          "
        >

          <Pencil size={18} />

          Edit

        </Link>


        <button
          onClick={handleDelete}
          className="
            flex items-center gap-2
            bg-red-600 text-white
            px-4 py-2 rounded-lg
          "
        >

          <Trash2 size={18} />

          Delete

        </button>

      </div>

    </motion.div>
  )
}

export default FareCard