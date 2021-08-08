export const isRoomConnection = (data = {}, client = {}) => {
    if (!data || !data.id || !data.room) {
        return false
    }
    if (!client || !client.id || !client.room) {
        return false
    }
    if (data.id === client.id || data.room !== client.room) {
        return false
    }
    return true
}