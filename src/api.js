const API_KEY = '61846baf7ac7e4c1c9713b9d98ebe8c2eda4fa82e67ae9a36257fdd2374639ee'

const tickersHandlers = new Map()
export const wrongTickers = []
const AGGREGATE_INDEX = '5'
const INVALID_SUB = '500'

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
        if (type === INVALID_SUB) {
            const { PARAMETER: stringCurrency } = JSON.parse(e.data)
            const currency = stringCurrency.split('~')
            if (!wrongTickers.includes(currency[2])) {
                wrongTickers.push(currency[2])
            }
        }
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

export const loadList = () => {
    const clues = []
    fetch(
        'https://min-api.cryptocompare.com/data/all/coinlist?summary=true'
    )
    .then(response => response.json())
    .then(exchangeData => {
        for (const key in exchangeData.Data) {
            if (exchangeData.Data.hasOwnProperty(key)) {
                clues.push(exchangeData.Data[key].Symbol)
            }
        }
    })
    return clues
}

