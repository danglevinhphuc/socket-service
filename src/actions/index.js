let clients = {};

const upsertClientId = (id, key, ws) => {
    const data = { key, ws }
    if (clients[`${id}`]) {
        clients[`${id}`] = clients[`${id}`].concat(data)
        return
    }
    clients[`${id}`] = [data]
}

const getClient = (id, key) => {
    console.log(id, key)
    return clients[`${id}`]
}
