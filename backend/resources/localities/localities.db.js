const prisma = require('../../config/prisma.js');

//CRUDs

const getAll = () => {
    return prisma.Locality.findMany({
        orderBy: {
            creadtedAt: 'desc'
        }
    });
}


const getOne = () => {
    return prisma.Locality.findUnique({
        where: {
            id: Number(id)
        }
    });
}


const create = (payload) => {
    return prisma.Locality.create({
        data: payload
    });
}


const update = (id, payload) => {
    return prisma.Locality.update({
        where: {
            id: Number(id)
        },

        data: payload
    });
}


const remove = (id) => {
    return prisma.Locality.delete({
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