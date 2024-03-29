import { Request, Response, NextFunction } from 'express'
import { Notification } from 'models'
import { getIO } from 'socket'

export const getNotifications = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const notifications = await Notification.find()
      .populate({
        path: 'senderId',
        select: ['username', 'profileImage'],
      })
      .sort({ createdAt: 'descending' })

    res.status(200).json(notifications)
  } catch (err: any) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}

export const readNotifications = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { notificationId } = req.params
  try {
    const notifications = await Notification.findById(notificationId)

    if (!notifications) {
      res.status(404).json('Notification is already read')
    }
    await notifications!.updateOne({ isRead: true })

    const notification = await Notification.find()
      .populate({
        path: 'senderId',
        select: ['username', 'profileImage'],
      })
      .sort({ createdAt: 'descending' })

    getIO().emit('quotes', { action: 'isRead', notifications: notification })

    res.status(200).json({ message: 'Notification marked as read' })
  } catch (err: any) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}
export const readAllNotifications = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await Notification!.updateMany({ isRead: true })

    const notifications = await Notification.find()
      .populate({
        path: 'senderId',
        select: ['username', 'profileImage'],
      })
      .sort({ createdAt: 'descending' })

    getIO().emit('quotes', { action: 'isRead', notifications })

    res
      .status(200)
      .json({ message: 'All notification marked as read', notifications })
  } catch (err: any) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}

export const deleteAll = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await Notification.deleteMany()
    getIO().emit('quotes', { action: 'deleteAll', notifications: [] })
    res.status(200).json({ message: 'Notifications deleted successfully' })
  } catch (err: any) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}
