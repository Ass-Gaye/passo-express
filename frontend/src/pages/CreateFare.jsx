import { useEffect, useState } from 'react';

import { getVehicleTypes } from '../services/vehicleTypes.service.js';

import { getLocalities } from '../services/localities.service.js';

import { createFare } from '../services/fares.service.js'

const CreateFare = () => {

    const [localities, setLocalities] = useState([])

    const [vehicleTypes, setVehicleTypes] = useState([])


    const [formData, setFormData] = useState({
        fromLocalityId: '',
        toLocalityId: '',
        vehicleTypeId: '',
        price: ''
    })

    useEffect( () => {

        const fetchData = async () => {
            try {

                const localitiesData = await getLocalities()

                const vehicleTpesData = await getVehicleTypes()

                setLocalities(localitiesData)
                setVehicleTypes(vehicleTpesData)

            } catch (error) {
                console.error(error)
            }

        }

        fetchData()

    }, [])


    const handleChange = (e) => {

        setFormData({ ...formData, [e.target.name]: e.target.value})

    }

     
    const handleSubmit = async (e) => {
        e.preventDefault()

        try {

            await createFare({
                fromLocalityId: Number(formData.fromLocalityId),
                toLocalityId: Number(formData.toLocalityId),
                vehicleTypeId: Number(formData.vehicleTypeId),
                price: Number(formData.price)
            })

            alert('Fare created successfully!')

            setFormData({
                fromLocalityId: '',
                toLocalityId: '',
                vehicleTypeId: '',
                price: ''
            })
            
        } catch (error) {
            console.error(error)

            alert('Failed to create fare. Please try again.')
        }
        
    }






    return(

        <div className='p-6 max-w-xl mx-auto'>

            <h1 className='text-3xl font-bold mb-6'>
                Create Fare
            </h1>

            <form onSubmit={handleSubmit} className='space-y-4'>

                <select name="fromLocalityId" value={formData.fromLocalityId} onChange={handleChange} className='border w-full p-3 rounded' required>

                    <option value=""> From Lcality</option>

                    {localities.map( (locality) => (

                        <option key={locality.id} value={locality.id}> {locality.name} </option>

                    ))}

                </select>

                <select name="vehicleTypeId" value={formData.vehicleTypeId} onChange={handleChange} className='border w-full p-3 rounded required'>
                    <option value=""> Vehicle Type</option>

                    {vehicleTypes.map( (vehicleType) => (

                        <option key={vehicleType.id} value={vehicleType.id}> {vehicleType.name} </option>

                    ))}

                </select>

                <input type="number" name="price" placeholder='Price' value={formData.price} onChange={handleChange} className='border w-full p-3 rounded' required />

                <button type="submit" className='bg-black text-white px-4 py-3 rounded w-full'>
                    Create Fare
                </button>

            </form>

        </div>

    )


}

export default CreateFare


