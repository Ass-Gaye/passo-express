
require('dotenv').config({
  path: require('path').resolve(__dirname, '../.env'),
})

const bcrypt = require('bcryptjs')
const prisma = require('../config/prisma.js')

async function seedLocalities() {
  const localities = [
    { name: 'Banjul', region: 'Banjul' },
    { name: 'Serrekunda', region: 'Kanifing' },
    { name: 'Brikama', region: 'West Coast Region' },
    { name: 'Farafenni', region: 'North Bank Region' },
    { name: 'Bwiam', region: 'West Coast Region' },
    { name: 'Basse', region: 'Upper River Region' },
    { name: 'Soma', region: 'Lower River Region' },
  ]

  const results = {}

  for (const locality of localities) {
    const saved = await prisma.locality.upsert({
      where: {
        name: locality.name,
      },
      update: {
        region: locality.region,
      },
      create: locality,
    })

    results[locality.name] = saved
  }

  return results
}

async function seedVehicleTypes() {
  const vehicleTypes = [
    {
      name: 'Gele Gele',
      description: 'Shared local transport van',
    },

    {
      name: 'Taxi',
      description: 'Standard taxi transport',
    },

    {
      name: 'Mini Bus',
      description: 'Passenger mini bus',
    },

    {
      name: 'Bush Taxi',
      description: 'Long distance commercial transport',
    },
  ]

  const results = {}

  for (const vehicleType of vehicleTypes) {
    const saved = await prisma.vehicleType.upsert({
      where: {
        name: vehicleType.name,
      },
      update: {
        description: vehicleType.description,
      },
      create: vehicleType,
    })

    results[vehicleType.name] = saved
  }

  return results
}

async function seedFares(localities, vehicleTypes) {
  const fares = [
    {
      fromLocalityId: localities['Banjul'].id,
      toLocalityId: localities['Serrekunda'].id,
      vehicleTypeId: vehicleTypes['Taxi'].id,
      price: 150,
    },

    {
      fromLocalityId: localities['Serrekunda'].id,
      toLocalityId: localities['Brikama'].id,
      vehicleTypeId: vehicleTypes['Gele Gele'].id,
      price: 50,
    },

    {
      fromLocalityId: localities['Brikama'].id,
      toLocalityId: localities['Soma'].id,
      vehicleTypeId: vehicleTypes['Bush Taxi'].id,
      price: 350,
    },

    {
      fromLocalityId: localities['Soma'].id,
      toLocalityId: localities['Basse'].id,
      vehicleTypeId: vehicleTypes['Bush Taxi'].id,
      price: 700,
    },

    {
      fromLocalityId: localities['Farafenni'].id,
      toLocalityId: localities['Basse'].id,
      vehicleTypeId: vehicleTypes['Mini Bus'].id,
      price: 500,
    },

    {
      fromLocalityId: localities['Banjul'].id,
      toLocalityId: localities['Bwiam'].id,
      vehicleTypeId: vehicleTypes['Mini Bus'].id,
      price: 300,
    },

    {
      fromLocalityId: localities['Serrekunda'].id,
      toLocalityId: localities['Farafenni'].id,
      vehicleTypeId: vehicleTypes['Bush Taxi'].id,
      price: 450,
    },
  ]

  for (const fare of fares) {
    await prisma.fare.upsert({
      where: {
        fromLocalityId_toLocalityId_vehicleTypeId: {
          fromLocalityId: fare.fromLocalityId,
          toLocalityId: fare.toLocalityId,
          vehicleTypeId: fare.vehicleTypeId,
        },
      },

      update: {
        price: fare.price,
      },

      create: fare,
    })
  }
}

async function seedRoutes(localities, vehicleTypes) {
  const routes = [
    {
      name: 'Banjul to Serrekunda Taxi',
      fromLocalityId: localities['Banjul'].id,
      toLocalityId: localities['Serrekunda'].id,
      vehicleTypeId: vehicleTypes['Taxi'].id,
      distance: 15,
      estimatedDuration: 35,
    },
    {
      name: 'Serrekunda to Brikama Gele Gele',
      fromLocalityId: localities['Serrekunda'].id,
      toLocalityId: localities['Brikama'].id,
      vehicleTypeId: vehicleTypes['Gele Gele'].id,
      distance: 20,
      estimatedDuration: 40,
    },
  ]

  const results = {}
  for (const route of routes) {
    const saved = await prisma.route.upsert({
      where: {
        fromLocalityId_toLocalityId_vehicleTypeId: {
          fromLocalityId: route.fromLocalityId,
          toLocalityId: route.toLocalityId,
          vehicleTypeId: route.vehicleTypeId,
        },
      },
      update: {
        name: route.name,
        distance: route.distance,
        estimatedDuration: route.estimatedDuration,
        isActive: true,
      },
      create: route,
    })
    results[route.name] = saved
  }
  return results
}

async function seedOperatorUser() {
  const hashedPassword = await bcrypt.hash('Operator123!', 10)
  const operator = await prisma.user.upsert({
    where: { email: 'operator@passo.com' },
    update: {
      name: 'Route Operator',
      role: 'OPERATOR',
      status: 'ACTIVE',
      password: hashedPassword,
    },
    create: {
      email: 'operator@passo.com',
      password: hashedPassword,
      name: 'Route Operator',
      phone: '2201234567',
      role: 'OPERATOR',
      status: 'ACTIVE',
    },
  })
  return operator
}

async function seedPassengerUser() {
  const hashedPassword = await bcrypt.hash('Passenger123!', 10)
  const passenger = await prisma.user.upsert({
    where: { email: 'passenger@passo.com' },
    update: {
      name: 'Test Passenger',
      role: 'PASSENGER',
      status: 'ACTIVE',
      password: hashedPassword,
    },
    create: {
      email: 'passenger@passo.com',
      password: hashedPassword,
      name: 'Test Passenger',
      phone: '2207654321',
      role: 'PASSENGER',
      status: 'ACTIVE',
    },
  })
  return passenger
}

async function seedVehicles(operator, routes) {
  const vehicles = [
    {
      licensePlate: 'GMD-TAXI-01',
      vehicleTypeId: routes['Banjul to Serrekunda Taxi'].vehicleTypeId,
      operatorId: operator.id,
      routeId: routes['Banjul to Serrekunda Taxi'].id,
      capacity: 4,
      status: 'AVAILABLE',
    },
  ]

  const results = {}
  for (const vehicle of vehicles) {
    const saved = await prisma.vehicle.upsert({
      where: { licensePlate: vehicle.licensePlate },
      update: {
        vehicleTypeId: vehicle.vehicleTypeId,
        operatorId: vehicle.operatorId,
        routeId: vehicle.routeId,
        capacity: vehicle.capacity,
        status: vehicle.status,
      },
      create: vehicle,
    })
    results[vehicle.licensePlate] = saved
  }
  return results
}

async function seedTrips(routes, vehicles) {
  const today = new Date()
  today.setHours(8, 0, 0, 0)

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(9, 0, 0, 0)

  const todayArrival = new Date(today.getTime() + 90 * 60000)
  const tomorrowArrival = new Date(tomorrow.getTime() + 90 * 60000)

  const trips = [
    {
      routeId: routes['Banjul to Serrekunda Taxi'].id,
      vehicleId: vehicles['GMD-TAXI-01'].id,
      departureTime: today,
      estimatedArrival: todayArrival,
      status: 'SCHEDULED',
    },
    {
      routeId: routes['Banjul to Serrekunda Taxi'].id,
      vehicleId: vehicles['GMD-TAXI-01'].id,
      departureTime: tomorrow,
      estimatedArrival: tomorrowArrival,
      status: 'SCHEDULED',
    },
  ]

  for (const trip of trips) {
    const exists = await prisma.trip.findFirst({
      where: {
        routeId: trip.routeId,
        vehicleId: trip.vehicleId,
        departureTime: trip.departureTime,
      },
    })
    if (!exists) {
      await prisma.trip.create({ data: trip })
    }
  }
}

async function main() {
  console.log('Starting database seed...')

  const localities = await seedLocalities()

  const vehicleTypes = await seedVehicleTypes()

  await seedFares(localities, vehicleTypes)

  const routes = await seedRoutes(localities, vehicleTypes)
  const operator = await seedOperatorUser()
  const passenger = await seedPassengerUser()
  const vehicles = await seedVehicles(operator, routes)
  await seedTrips(routes, vehicles)

  console.log('Gambian transport data seeded successfully')
}

main()
  .catch((error) => {
    console.error('Seed failed')
    console.error(error)

    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })




































  // const prisma = require('../config/prisma.js');
// require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') })

// async function main() {

//   // =========================
//   // LOCALITIES
//   // =========================

//   const banjul = await prisma.locality.create({
//     data: {
//       name: 'Banjul',
//       region: 'Banjul'
//     }
//   })

//   const serrekunda = await prisma.locality.create({
//     data: {
//       name: 'Serrekunda',
//       region: 'Kanifing'
//     }
//   })

//   const brikama = await prisma.locality.create({
//     data: {
//       name: 'Brikama',
//       region: 'West Coast Region'
//     }
//   })

//   const farafenni = await prisma.locality.create({
//     data: {
//       name: 'Farafenni',
//       region: 'North Bank Region'
//     }
//   })

//   const bwiam = await prisma.locality.create({
//     data: {
//       name: 'Bwiam',
//       region: 'West Coast Region'
//     }
//   })

//   const basse = await prisma.locality.create({
//     data: {
//       name: 'Basse',
//       region: 'Upper River Region'
//     }
//   })

//   const soma = await prisma.locality.create({
//     data: {
//       name: 'Soma',
//       region: 'Lower River Region'
//     }
//   })


//   // =========================
//   // VEHICLE TYPES
//   // =========================

//   const geleGele = await prisma.vehicleType.create({
//     data: {
//       name: 'Gele Gele',
//       description: 'Shared local transport van'
//     }
//   })

//   const taxi = await prisma.vehicleType.create({
//     data: {
//       name: 'Taxi',
//       description: 'Standard taxi transport'
//     }
//   })

//   const miniBus = await prisma.vehicleType.create({
//     data: {
//       name: 'Mini Bus',
//       description: 'Passenger mini bus'
//     }
//   })

//   const bushTaxi = await prisma.vehicleType.create({
//     data: {
//       name: 'Bush Taxi',
//       description: 'Long distance commercial transport'
//     }
//   })


//   // =========================
//   // FARES
//   // =========================

//   await prisma.fare.createMany({
//     data: [

//       {
//         fromLocalityId: banjul.id,
//         toLocalityId: serrekunda.id,
//         vehicleTypeId: taxi.id,
//         price: 150
//       },

//       {
//         fromLocalityId: serrekunda.id,
//         toLocalityId: brikama.id,
//         vehicleTypeId: geleGele.id,
//         price: 50
//       },

//       {
//         fromLocalityId: brikama.id,
//         toLocalityId: soma.id,
//         vehicleTypeId: bushTaxi.id,
//         price: 350
//       },

//       {
//         fromLocalityId: soma.id,
//         toLocalityId: basse.id,
//         vehicleTypeId: bushTaxi.id,
//         price: 700
//       },

//       {
//         fromLocalityId: farafenni.id,
//         toLocalityId: basse.id,
//         vehicleTypeId: miniBus.id,
//         price: 500
//       },

//       {
//         fromLocalityId: banjul.id,
//         toLocalityId: bwiam.id,
//         vehicleTypeId: miniBus.id,
//         price: 300
//       },

//       {
//         fromLocalityId: serrekunda.id,
//         toLocalityId: farafenni.id,
//         vehicleTypeId: bushTaxi.id,
//         price: 450
//       }

//     ]
//   })


//   console.log('Gambian transport data seeded successfully')
// }


// main()
//   .catch((error) => {
//     console.error(error)

//     process.exit(1)
//   })
//   .finally(async () => {
//     await prisma.$disconnect()
//   })
