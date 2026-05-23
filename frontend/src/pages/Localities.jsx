import { useEffect, useState } from "react";

import { getLocalities } from "../services/localities.service";


const Localities = () => {

    const [localities, setLocalities] = useState([])


    useEffect( () => {

        const fetchLocalities = async () => {
            try {
                const data = await getLocalities()

                setLocalities(data)
                
            } catch (error) {
                console.error(error)
            }     
        }

    }, [])




    return(

        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">
                Localities
            </h1>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">

                {localities.map( (locality) => (

                    <div key={locality.id} className="border p-4 rounded-lg shadow">

                        <h2 className="text-xl font-semibold">
                            {locality.name}
                        </h2>

                        <p>
                            {locality.region}
                        </p>

                    </div>

                ))}

            </div>

        </div>
    )

}

export default Localities