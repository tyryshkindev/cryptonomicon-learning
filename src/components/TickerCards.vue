<template v-if="tickers.length">
    <div>
      <hr class="w-full border-t border-gray-600 my-4" />
      <StateUpdate 
      :tickers="tickers"
      @paginated-tickers="changePaginated"
      />
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
      <DeleteTicker 
      @click.stop="handleDelete(t)"
      />
    </div>
  </dl>
  <hr class="w-full border-t border-gray-600 my-4" />
</template>
<script>
import { subscribeToTicker, unsubscribeFromTicker, wrongTickers } from '@/api'
import { copy } from '@/helpers'
import DeleteTicker from './DeleteTicker.vue'
import StateUpdate from './StateUpdate.vue'
export default {
    components: {
    StateUpdate,
    DeleteTicker
},
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
            tickers: [],
            bc: new BroadcastChannel('cryptonomicon-update'),
            wrongTickers: wrongTickers,
            paginatedTickers: [],
        }
    },
    watch: {
        newTicker() {
            this.add(this.newTicker)
        }
    },

    mounted() {
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

    methods: {
        updateTickers(value) {
            this.tickers = value
        },
        changePaginated(value) {
            this.paginatedTickers = value
        },
        changePrice(value) {
            this.$emit('price-changed', value)
        },
        changeSelection(value) {
            this.$emit('selection-changed', value)
        },
        changeExists(value) {
            this.$emit('exists-changed', value)
        },
        closeGraph(value) {
            this.changeSelection(value)
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
                // обнулить фильтр
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
            // обнулить фильтр
            unsubscribeFromTicker(tickerToRemove.name)
            this.bc.postMessage(copy(this.tickers))
        },
    }
}
</script>