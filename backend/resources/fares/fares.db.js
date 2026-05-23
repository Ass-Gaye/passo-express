const prisma = require('../../config/prisma.js');

const getAll = async () => {
    try {
        return await prisma.Fare.findMany({
            include: {
                fromLocality: true,
                toLocality: true,
                vehicleType: true
            },

            orderBy: {
                createdAt: 'desc'
            }
    });

    } catch (error) {
        console.log('cannot find fares', error);  
    }
}

const getOne = async (id) => {
    return await prisma.Fare.findUnique({
        where: {
            id: Number(id)
        },

        include: {
            fromLocality: true,
            toLocality: true,
            vehicleType: true
        }
    });
}

const create = async (payload) => {
     const fare = await prisma.Fare.create({
        data: {
            fromLocalityId: payload.fromLocalityId,
            toLocalityId: payload.toLocalityId,
            vehicleTypeId: payload.vehicleTypeId,
            price: payload.price
        }
    });

    return fare
}

const update = async (id, payload) => {
    return await prisma.Fare.update({
        where: {
            id: Number(id)
        },

        data: {
            payload
        }
    });
}

const remove = async (id) => {
    return await prisma.Fare.delete({
        where: {
            id: Number(id)
        }
    });
}

module.exports = {
    getAll,
    getOne,
    create,
    update,
    remove

}