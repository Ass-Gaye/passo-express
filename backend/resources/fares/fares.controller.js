const fareDB = require('./fares.db.js');
const prisma = require('../../config/prisma.js');

const getFares = async (req, res) => {
    try {
        const fares = await fareDB.getAll();

        res.status(200).json(fares);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }   
}


const getFare = async (req, res) => {
    try {
        const fare = await fareDB.getOne(req.params.id);

        if (!fare) {
            return res.status(404).json({
                message: 'Fare Not Found'
            });
        }

        res.status(200).json(fare)

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }  
}



const createFare = async (req, res) => {
    try {
        const fare = await fareDB.create(req.body)

        res.status(201).json(fare)

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }   
}



const updateFare = async (req, res) => {
    try {
        const fareId = Number(req.params.id);
        const oldFare = await fareDB.getOne(fareId);

        if (!oldFare) {
            return res.status(404).json({ message: 'Fare not found' });
        }

        const updatedFare = await fareDB.update(fareId, req.body);

        const newPrice = Number(req.body.price ?? oldFare.price);
        const priceChanged = newPrice !== oldFare.price;

        if (priceChanged) {
            await prisma.priceHistory.create({
                data: {
                    fareId: oldFare.id,
                    previousPrice: oldFare.price,
                    newPrice,
                    reason: req.body.reason || 'Fare price updated',
                    changedBy: req.user?.id || null,
                },
            });

            const bookings = await prisma.booking.findMany({
                where: {
                    fareId: oldFare.id,
                    status: 'CONFIRMED',
                },
                select: {
                    passengerId: true,
                },
            });

            const userIds = [...new Set(bookings.map((booking) => booking.passengerId))];

            const notificationPayload = {
                type: 'FARE_UPDATE',
                title: 'Fare Updated',
                message: `The fare from ${oldFare.fromLocality.name} to ${oldFare.toLocality.name} has been updated from GMD ${oldFare.price} to GMD ${newPrice}.`,
            };

            const createdNotifications = await Promise.all(
                userIds.map((userId) =>
                    prisma.notification.create({
                        data: {
                            userId,
                            type: notificationPayload.type,
                            title: notificationPayload.title,
                            message: notificationPayload.message,
                        },
                    })
                )
            );

            const io = req.app.get('io');
            if (io) {
                createdNotifications.forEach((notification) => {
                    io.to(`user-${notification.userId}`).emit('notification', notification);
                });
            }
        }

        res.status(200).json(updatedFare);

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }  
}



const deleteFare = async (req, res) => {

    try {

        await fareDB.remove(req.params.id);

        res.status(200).json({
            message: 'Fare deleted successfully'
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
}



module.exports = {
    getFares,
    getFare,
    createFare,
    updateFare,
    deleteFare
}