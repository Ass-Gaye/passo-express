const prisma = require('../../config/prisma.js');


// ======================
// GET ALL LOCALITIES
// ======================

const getAll = () => {

    return prisma.locality.findMany({

        orderBy: {
            createdAt: 'desc'
        }

    });

};


// ======================
// GET ONE LOCALITY
// ======================

const getOne = (id) => {

    return prisma.locality.findUnique({

        where: {
            id: Number(id)
        }

    });

};


// ======================
// CREATE LOCALITY
// ======================

const create = (payload) => {

    return prisma.locality.create({

        data: payload

    });

};


// ======================
// UPDATE LOCALITY
// ======================

const update = (id, payload) => {

    return prisma.locality.update({

        where: {
            id: Number(id)
        },

        data: payload

    });

};


// ======================
// DELETE LOCALITY
// ======================

const remove = (id) => {

    return prisma.locality.delete({

        where: {
            id: Number(id)
        }

    });

};


module.exports = {
    getAll,
    getOne,
    create,
    update,
    remove
};