<template> 
    <button 
        v-if="page > 1"
        @click="pageChanged(this.page - 1)"
        class="my-4 mx-2 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
        Назад
      </button>
      <button 
        v-if="hasNextPage"
        @click="pageChanged(this.page + 1)"
        class="my-4 mx-2 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
        Вперед
      </button>
</template>
<script>
export default {
    props: {
        page: {
            type: Number,
            required: true
        },
        notPaginated: {
            type: Array,
            required: true
        }
    },
    emits: [
        'pagination-complete',
        'page-changed'
    ],
    data() {
        return {
            filteredTickers: []
        }
    },
    watch: {
        notPaginated() {
            this.filteredTickers = this.notPaginated
            if (this.paginatedTickers.length === 0 && this.page > 1) {
                this.pageChanged(this.page - 1)
            }
            this.$emit('pagination-complete', this.paginatedTickers)
        }
    },
    computed: {
        startIndex() {
            return (this.page - 1) * 6
        },

        endIndex() {
            return this.page * 6
        },

        paginatedTickers() {
            return this.filteredTickers.slice(this.startIndex, this.endIndex)
        },

        hasNextPage() {
            return this.filteredTickers.length > this.endIndex
        },
    },
    methods: {
        pageChanged(value) {
            this.$emit('page-changed', value)
        },
    }
}
</script>