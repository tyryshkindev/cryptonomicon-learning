const API_KEY = '3ae297140a9f7c800ccd0bfac0719741592e8d9fb4f8b9b522f49f5aee143ad8'

const tickersHandlers = new Map()
const AGGREGATE_INDEX = '5'

const bc = new BroadcastChannel('cryptonomicon')
const socket = new WebSocket(`wss://streamer.cryptocompare.com/v2/?api_key=${API_KEY}`)

bc.addEventListener('message', event => {
    const { currency, newPrice } = event.data
    const handlers = tickersHandlers.get(currency) ?? []
    handlers.forEach(fn => fn(newPrice))
})

socket.addEventListener('message', e => {
    const { TYPE: type, FROMSYMBOL: currency, PRICE: newPrice } = JSON.parse(e.data)
    if (type !== AGGREGATE_INDEX || newPrice === undefined) {
        return
    }

    const handlers = tickersHandlers.get(currency) ?? []
    handlers.forEach(fn => fn(newPrice))

    bc.postMessage({currency, newPrice})

})

function sendToWebSocket(message) {
    const stringifiedMessage = JSON.stringify(message)
    if (socket.readyState === WebSocket.OPEN) {
        socket.send(stringifiedMessage)
        return
    } socket.addEventListener('open', () => {
        socket.send(stringifiedMessage)
    }, {once: true})
}

function subscribeToTickerOnWS(ticker) {
    sendToWebSocket({
        action: "SubAdd",
        subs: [`5~CCCAGG~${ticker}~USD`]
    })
}

function unsubscribeFromTickerOnWS(ticker) {
    sendToWebSocket({
        action: "SubRemove",
        subs: [`5~CCCAGG~${ticker}~USD`]
    })
}

export const subscribeToTicker = (ticker, cb) => {
    const subscribers = tickersHandlers.get(ticker) || []
    tickersHandlers.set(ticker, [...subscribers, cb])
    subscribeToTickerOnWS(ticker)
}

export const unsubscribeFromTicker = ticker => {
    tickersHandlers.delete(ticker)
    unsubscribeFromTickerOnWS(ticker)
}

export const loadList = () => 
    fetch(
        'https://min-api.cryptocompare.com/data/all/coinlist?summary=true'
    ).then(f => f.json())

