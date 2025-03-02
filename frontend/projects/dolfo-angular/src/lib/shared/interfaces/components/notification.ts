export type NotificationType = "success" | "error" | "info" | "warning"

export type INotificationInput = {
    message: string
    title?: string
    type?: NotificationType
    action?: NotificationAction
}

export type NotificationAction = {
    label: string,
    click: () => void
}