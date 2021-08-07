import redis from 'redis'
const HOST = process.env.REDIS_HOST || 'redis-15502.c283.us-east-1-4.ec2.cloud.redislabs.com'
const PORT = process.env.REDIS_PORT || '15502'
const PASS = process.env.REDIS_PASS || Fdc6LmJM7r77uRqDdoUjfgKodTuAwPVP

let opts = {
    host: HOST,
    port: PORT,
    password: PASS
}

export const subscriber = redis.createClient(opts);
export const publisher = subscriber.duplicate();

let ins = null

const cacheInit = (
    opts = opts,
) => {
    if (ins) {
        return ins
    }
    ins = redis.createClient(opts)
    return ins
}

const cacheFunc = {
    get({ key, transaction = cacheInit() }) {
        return new Promise((resolve, reject) => {
            console.log('redis get', key)
            transaction.get(key, (err, res) => {
                console.log('redis get', key, 'ok', err)
                if (err) return reject(err)
                return resolve(res)
            })
        })
    },
    set({ data, key, exp, transaction = cacheInit() }) {
        return new Promise((resolve, reject) => {
            console.log('redis set', key)
            transaction.set(key, JSON.stringify(data), 'EX', exp, (err, res) => {
                console.log('redis set', key, 'ok', err)
                if (err) return reject(err)
                return resolve(res)
            })
        })
    },
    incr({ key, exp, transaction = cacheInit() }) {
        const prs = []
        prs.push(
            new Promise((resolve, reject) => {
                transaction.incr(key, (err, res) => {
                    if (err) return reject(err)
                    return resolve(res)
                })
            }),
        )
        if (exp) {
            prs.push(
                new Promise((resolve, reject) => {
                    transaction.expire(key, exp, (err, res) => {
                        if (err) return reject(err)
                        return resolve(res)
                    })
                }),
            )
        }
        return Promise.all(prs)
    },
    delete({ key, transaction = cacheInit() }) {
        return new Promise((resolve, reject) => {
            console.log('redis del', key)
            transaction.del(key, (err, res) => {
                console.log('redis del', key, 'ok', err)
                if (err) return reject(err)
                return resolve(res)
            })
        })
    },
}

export default cacheFunc
