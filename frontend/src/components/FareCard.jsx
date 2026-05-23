


const FareCard =  ({ fare }) => {
    return(

        <div className="border rounded-lg p-4 shadow-md">
            <h2 className="text-xl font-bold mb-2">
                {fare.fromLocality.name} → {fare.toLcality.name}
            </h2>

            <p>
                Vehicle: {fare.vehicleType.name}
            </p>

            <p className="font-semibold text-lg mt-2">
                D{fare.price}
            </p>
        </div>
    )
}

export default FareCard