<template>
    <div>
        Фильтр: 
        <input 
        v-model="filter" 
        @input="filterChanged"
        />
    </div>
</template>
<script>

export default {
    props: {
        tickers: {
            type: Array,
            required: true
        },
        page: {
            type: Number,
            required: true
        },
        initial_filter: {
            Type: String,
            required: false
        }
    },
    emits: [
        'filter-changed',
        'tickers-filter'
    ],
    data() {
        return {
            filter: '',
        }
    },
    watch: {
        filter() {
            this.$emit('tickers-filter', this.filteredTickers)
        },
        page() {
            this.$emit('tickers-filter', this.filteredTickers)
        },
        initial_filter() {
            this.filter = this.initial_filter
        }
    },
    computed: {
        filteredTickers() {
            return this.tickers
                .filter(ticker => ticker.name
                .includes(this.filter.toUpperCase()))

        },
    },
    methods: {
        filterChanged() {
            this.$emit('filter-changed', this.filter)
        }
    }
}
</script>