<template>
    <TickersPagination 
    :page="page"
    @page-changed="changePage"
    :notPaginated="notPaginated"
    @pagination-complete="changePaginated"
    />
    <FilterTickers 
    :page="page"
    :tickers="tickers"
    @filter-changed="changeFilter"
    @tickers-filter="changeFiltered"
    />
</template>
<script>
import TickersPagination from './TickersPagination.vue'
import FilterTickers from './FilterTickers.vue'
export default {
    components: {
        TickersPagination,
        FilterTickers
    },
    props: {
        tickers: {
            type: Array,
            required: true
        }
    },
    emits: [
        'paginated-tickers',
    ],  
    data() {
        return {
            page: 1,
            filter: '',
            notPaginated: [],
            initial_filter: ''
        }
    },
    mounted() {
        const windowData = Object.fromEntries(new URL(window.location).searchParams.entries())
        if (windowData.page) {
            this.page = Number(windowData.page)
        }
        if (windowData.filter) {
            this.filter = windowData.filter
            this.initial_filter = windowData.filter
        }
    },
    watch: {
        pageStateOptions(value) {
            window.history.pushState(
                null,
                document.title,
                `${window.location.pathname}?filter=${value.filter}&page=${value.page}`
            )
        },
        tickers() {
            localStorage.setItem('cryptonomicon-list', JSON.stringify(this.tickers))
            this.notPaginated = this.tickers
        },
        page() {
            this.notPaginated = this.tickers
        }
    },
    computed: {
        pageStateOptions() {
            return {
                filter: this.filter,
                page: this.page
            }
        },
    },
    methods: {
        changePaginated(value) {
            this.$emit('paginated-tickers', value)
        },
        changeFiltered(value) {
            this.notPaginated = value
        },
        changeFilter(value) {
            this.filter = value
            this.page = 1
        },
        changePage(value) {
            this.page = Number(value)
        },
    }
}
</script>