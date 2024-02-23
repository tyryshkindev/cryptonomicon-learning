const API_KEY = '3ae297140a9f7c800ccd0bfac0719741592e8d9fb4f8b9b522f49f5aee143ad8'

const tickersHandlers = new Map()

const loadTickers = () => {
    if (tickersHandlers.size === 0) {
        return
    }
    fetch(
      `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${[...tickersHandlers
      .keys()]
      .join(',')}&tsyms=USD&api_key=${API_KEY}`
    )
      .then(r => r.json())
      .then(rawData => {
        const updatedPrices = Object.fromEntries(
        Object.entries(rawData).map(([key, value]) => [key, value.USD])
        )
        Object.entries(updatedPrices).forEach(([currency, newPrice]) => {
            const handlers = tickersHandlers.get(currency) ?? []
            handlers.forEach(fn => fn(newPrice))
        })
        }
    )
}

export const subscribeToTicker = (ticker, cb) => {
    const subscribers = tickersHandlers.get(ticker) || []
    tickersHandlers.set(ticker, [...subscribers, cb])
}

export const unsubscribeFromTicker = ticker => {
    tickersHandlers.delete(ticker)
}

setInterval(loadTickers, 5000);

export const loadList = () => 
    fetch(
        'https://min-api.cryptocompare.com/data/all/coinlist?summary=true'
    ).then(f => f.json())