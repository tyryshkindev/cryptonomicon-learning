<template v-if="tickers.length">
    <div>
      <hr class="w-full border-t border-gray-600 my-4" />
      <button 
        v-if="page > 1"
        @click="page = page - 1"
        class="my-4 mx-2 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
        Назад
      </button>
      <button 
        v-if="hasNextPage"
        @click="page = Number(page) + Number(1)"
        class="my-4 mx-2 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
        Вперед
      </button>
      <div>Фильтр: <input v-model="filter" @input="page = 1"/></div>
      <hr class="w-full border-t border-gray-600 my-4" />
    </div>
  <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
    <div
      v-for="t in paginatedTickers"
      :key="t.name"
      @click="select(t)"
      :class="{
        'border-4': selectedTicker === t
      }"
      class="bg-white overflow-hidden shadow rounded-lg border-purple-800 border-solid cursor-pointer"
    >
    <div :class="{
      'bg-red-100': wrongTickers.includes(t.name)
    }">
      <div class="px-4 py-5 sm:p-6 text-center">
        <dt class="text-sm font-medium text-gray-500 truncate">
          {{  t.name  }} - USD
        </dt>
        <dd class="mt-1 text-3xl font-semibold text-gray-900">
          {{ formatPrice(t.price) }}
        </dd>
      </div>
    </div>
      <div class="w-full border-t border-gray-200"></div>
      <button
        @click.stop="handleDelete(t)"
        class="flex items-center justify-center font-medium w-full bg-gray-100 px-4 py-4 sm:px-6 text-md text-gray-500 hover:text-gray-600 hover:bg-gray-200 hover:opacity-20 transition-all focus:outline-none"
      >
        <svg
          class="h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="#718096"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
            clip-rule="evenodd"
          ></path></svg>Удалить
      </button>
    </div>
  </dl>
  <hr class="w-full border-t border-gray-600 my-4" />
</template>
<script>
import { subscribeToTicker, unsubscribeFromTicker, wrongTickers } from '@/api'
import { copy } from '@/helpers'
export default {
    props: {
        newTicker: {
            type: String,
            required: false
        },
        exists: {
            type: Boolean,
            required: false
        },
        selectedTicker: {
            type: Object,
            required: false
        },
        price: {
            type: Number,
            required: false
        }
    },
    emits: [
        'price-changed', 
        'selection-changed', 
        'exists-changed'
    ],
    data() {
        return {
            filter: '',
            tickers: [],
            page: 1,
            // exists: false,
            // selectedTicker: null,
            bc: new BroadcastChannel('cryptonomicon-update'),
            exportedPrice: 0,
            wrongTickers: wrongTickers,
        }
    },
    watch: {
        // newExists() {
        //     this.handleExistsChanged(this.newExists)
        // },
        newTicker() {
            this.add(this.newTicker)
        },
        tickers() {
            localStorage.setItem('cryptonomicon-list', JSON.stringify(this.tickers))
        },
        filter() {
            this.page = 1
        },
        pageStateOptions(value) {
            window.history.pushState(
                null,
                document.title,
                `${window.location.pathname}?filter=${value.filter}&page=${value.page}`
            )
        },
        paginatedTickers() {
            if (this.paginatedTickers.length === 0 && this.page > 1) {
                this.page -= 1
            }
        },
    },

    mounted() {
        const windowData = Object.fromEntries(new URL(window.location).searchParams.entries())
        if (windowData.filter) {
            this.filter = windowData.filter
        }

        if (windowData.page) {
            this.page = windowData.page
        }
        const tickersData = localStorage.getItem('cryptonomicon-list')
        if (tickersData) {
            this.tickers = JSON.parse(tickersData)
            this.tickers.forEach(ticker => {
                subscribeToTicker(ticker.name, newPrice =>
                    this.updateTicker(ticker.name, newPrice)
                )
            })
        }
        this.bc.addEventListener('message', event => {
            this.tickers = event.data
        })
    },

    computed: {
        pageStateOptions() {
            return {
                filter: this.filter,
                page: this.page
            }
        },
        startIndex() {
            return (this.page - 1) * 6
        },

        endIndex() {
            return this.page * 6
        },

        filteredTickers() {
            return this.tickers
                .filter(ticker => ticker.name
                .includes(this.filter.toUpperCase()))

        },

        paginatedTickers() {
            return this.filteredTickers.slice(this.startIndex, this.endIndex)
        },

        hasNextPage() {
            return this.filteredTickers.length > this.endIndex
        },
    },

    methods: {
        changePrice(value) {
            this.$emit('price-changed', value)
        },
        changeSelection(value) {
            this.$emit('selection-changed', value)
        },
        changeExists(value) {
            this.$emit('exists-changed', value)
        },
        closeGraph() {
            this.changeSelection(null)
        },
        // handleExistsChanged(newExistsValue) {
        //     this.exists = newExistsValue;
        // },
        checkWrong() {
            return this.paginatedTickers.some(t => wrongTickers.includes(t.name))
        },
        updateTicker(tickerName, price) {
            this.tickers
                .filter(t => t.name === tickerName)
                .forEach(t => {
                    if (t === this.selectedTicker) {
                        this.changePrice(price)
                    }
                    t.price = price
                })
        },
        formatPrice(price) {
            if (price === '-') {
                return price
            }
            return price > 1 ? price.toFixed(2) : price.toPrecision(2);
        },
        add(ticker) {
            const currentTicker = {
                name: ticker.toUpperCase(),
                price: '-'
            }
            if (!(this.tickers.some(t => t.name === currentTicker.name))) {
                this.tickers = [...this.tickers, currentTicker]
                this.filter = ''
                this.changeExists(false)
                subscribeToTicker(currentTicker.name, newPrice =>
                    this.updateTicker(currentTicker.name, newPrice)
                )
                this.bc.postMessage(copy(this.tickers))
            } else {
                this.changeExists(true)
            }
        },
        select(ticker) {
            this.changeSelection(ticker)
        },
        handleDelete(tickerToRemove) {
            this.tickers = this.tickers.filter(t => t !== tickerToRemove)
            if (this.selectedTicker === tickerToRemove) {
                this.closeGraph()
            }
            unsubscribeFromTicker(tickerToRemove.name)
            this.bc.postMessage(copy(this.tickers))
        },
    }
}
</script>