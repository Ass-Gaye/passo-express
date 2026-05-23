import { useEffect, useState } from 'react';
import { getFares } from '../services/fares.service';
import Navbar from '../components/Navbar';

const Fares = () => {

    const [fares, setFares] = useState([])

    const [loading, setLoading] = useState(true)


    useEffect( () => {

        const fetchFares = async () => {
            try {
                const data = await getFares()

                setFares(data)
                
            } catch (error) {
                console.error(error)
                
            } finally {
                setLoading(false)
            }
            
        }

    }, [])


    if (loading) {
        return <p className='p-6'> Loading fares...</p>
        
    }


    return(

        <div className='p-6'>
            <h1 className='text-3xl font-bold mb-6'>
                Transport Fares
            </h1>

            <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4'>

                 {fares.map( (fare) => (<FareCard key={fare.id} fare={fare}/> )) }
                
            </div>

        </div>

        
    )

}

export default Fares