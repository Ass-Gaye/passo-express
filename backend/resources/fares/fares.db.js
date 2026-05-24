const prisma = require('../../config/prisma.js');

const getAll = async () => {

    return prisma.fare.findMany({

        include: {
            fromLocality: true,
            toLocality: true,
            vehicleType: true
        }

    });

};


const getOne = async (id) => {
    return await prisma.fare.findUnique({
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
     const fare = await prisma.fare.create({
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

    return await prisma.fare.update({

        where: {
            id: Number(id)
        },

        data: {
            fromLocalityId: Number(payload.fromLocalityId),

            toLocalityId: Number(payload.toLocalityId),

            vehicleTypeId: Number(payload.vehicleTypeId),

            price: Number(payload.price)
        }
    });
}

const remove = async (id) => {
    return await prisma.fare.delete({
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