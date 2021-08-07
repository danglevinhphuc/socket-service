import path from 'path'
import dotenv from "dotenv"
import cors from 'cors'
import events from 'events'
events.EventEmitter.prototype._maxListeners = 100;

const configPath = path.join(process.cwd(), 'conf', '.env')
dotenv.config({ path: configPath })

const DOMAIN_CONNECTION = process.env.DOMAIN_CONNECTION
const whitelist = DOMAIN_CONNECTION ? DOMAIN_CONNECTION.split(',') : []

const corsOptionsDelegate = (req, callback) => {
    let corsOptions;
    if (whitelist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
    } else {
        corsOptions = { origin: false } // disable CORS for this request
    }
    callback(null, corsOptions) // callback expects two parameters: error and options
}

export default function () {
    return cors(corsOptionsDelegate)
}