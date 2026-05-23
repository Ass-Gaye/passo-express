// resources/vehicle-types/vehicleTypes.db.js

const prisma = require('../../config/prisma.js');

const create = async (payload) => {
  return await prisma.vehicleType.create({
    data: {
      name: payload.name
    }
  });
}



const getAll = async () => {
  return await prisma.vehicleType.findMany()
}



const getOne = async (id) => {
  return await prisma.vehicleType.findUnique({
    where: {
      id: Number(id)
    }
  });
}



const update = async (id, payload) => {
  return await prisma.vehicleType.update({
    where: {
      id: Number(id)
    },
    data: {
      name: payload.name
    }
  });
}



const remove = async (id) => {
  return await prisma.vehicleType.delete({
    where: {
      id: Number(id)
    }
  });
}


module.exports = {
  create,
  getAll,
  getOne,
  update,
  remove
}