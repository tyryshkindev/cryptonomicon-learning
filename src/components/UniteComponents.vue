<template>
    <div class="container mx-auto flex flex-col items-center bg-gray-100 p-4">
        <div class="container">
            <div class="w-full my-4"></div>
            <InputTicker 
            @add-method="add" 
            @exists-changed="changeExists" 
            :exists="exists" 
            />
            <TickerCards 
            :newTicker="newTicker"
            @exists-changed="changeExists"
            :exists="exists"
            :selectedTicker="selectedTicker"
            @selection-changed="changeSelection"
            :price="price"
            @price-changed="changePrice"
            />
            <DisplayGraph 
            :selectedTicker="selectedTicker" 
            :price="price" 
            @close-graph="changeSelection" 
            />
        </div>
    </div>
</template>
<script>
import InputTicker from './InputTicker.vue'
import DisplayGraph from './DisplayGraph.vue'
import TickerCards from './TickerCards.vue'
export default {
    components: {
    InputTicker,
    DisplayGraph,
    TickerCards
  },
  data() {
    return {
        newTicker: '',
        exists: false,
        selectedTicker: null,
        price: 0
    }
  },
  methods: {
    add(newValue) {
        this.newTicker = newValue
    },
    changeExists(newValue) {
        this.exists = newValue
    },
    changeSelection(newSelected) {
        this.selectedTicker = null
        this.selectedTicker = newSelected
    },
    changePrice(newPrice) {
        this.price = newPrice
    },
  }

}
</script>