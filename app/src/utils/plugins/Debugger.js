export const DEBUGGER_KEY = 'DEBUGGER'

const Debuger = {
    log: message => console.log(message),
    error: message => console.error(message),
    warn: message => console.warn(message),
    debug: (key, val) => console.log(key, val)
}

const Install = app => {
    app.provide(DEBUGGER_KEY, Debuger)
    global.DEBUGGER = Debuger
}

export default Install