let fares = [
    { id: 1, from: 'Banjul', to: 'Serekunda', vehicleType: 'Taxi', price: 15,
    lastUpdated: '2026-03-01' },

    { id: 2, from: 'Banjul', to: 'Serekunda', vehicleType: 'Bus', price: 12,
    lastUpdated: '2026-03-01' },

    { id: 3, from: 'Banjul', to: 'Serekunda', vehicleType: 'Gelegele', price:
    10, lastUpdated: '2026-03-01' },

    { id: 4, from: 'Brikama', to: 'Banjul', vehicleType: 'Taxi', price: 25,
    lastUpdated: '2026-03-01' },

    { id: 5, from: 'Brikama', to: 'Banjul', vehicleType: 'Bus', price: 20,
    lastUpdated: '2026-03-01' },

    { id: 6, from: 'Serekunda', to: 'Brikama', vehicleType: 'Taxi', price: 20,
    lastUpdated: '2026-03-01' },

    { id: 7, from: 'Banjul', to: 'Soma', vehicleType: 'Bus', price: 80,
    lastUpdated: '2026-03-01' },
    
    { id: 8, from: 'Farafenni', to: 'Banjul', vehicleType: 'Bus', price: 100,
    lastUpdated: '2026-03-01' }
];

let nextId = 9;

const getAllFares = () => {
return fares;
}

const getFareById = (id) => {
    console.log(id);
    
   return fares.find((f) =>  f.id === id)

};

console.log(getFareById(2));


const searchFares = (filters) => {
    let results = fares;

    if (filters.from) {
        results = results.filter(f => f.from.toLowercase() === filters.from.toLowercase());
    }

    if (filters.to) {
        results = results.filter(f => f.to.tolowrecase() === filters.to.toLowercase());  
    }

    if (filters.vehicleType) {
        results = results.filter(f => f.vehicleType.toLowercase() === filters.vehicleType.toLowercase());  
    }

    return results;

};

const createFare = (fareData) => {
    const newFare = {
        id: nextId++,
        ...fareData,
        lastUpdated: new Date().toISOString().split('T')[0]
    };

    fares.push(newFare);
    return newFare;

};

const updateFare = (id, updates) => {
    const index = fares.findIndex(f => f.id === id);

    if (index === -1) return null;

    fares[index] = {
        ...fares[index],
        ...updates,
        id,
        lastUpdated: new Date().toISOString().split('T')[0]
    };

    return fares[index]

};

const deleteFare = (id) => {
    const index = fares.findIndex(f => f.id === id);

    if (index === -1) return false;

    fares.splice(index, 1);
    return true;


};

module.exports = {
    getAllFares,
    getFareById,
    searchFares,
    createFare,
    updateFare,
    deleteFare

};





