<template>
    <div v-if="this.shown.length" class="flex bg-white p-1 rounded-md shadow-md flex-wrap">
        <span v-if="this.shown[0]" @click="useClue(0)"
            class="inline-flex items-center px-2 m-1 rounded-md text-xs font-medium bg-gray-300 text-gray-800 cursor-pointer">
            {{ this.shown[0] }}
        </span>
        <span v-if="this.shown[1]" @click="useClue(1)"
            class="inline-flex items-center px-2 m-1 rounded-md text-xs font-medium bg-gray-300 text-gray-800 cursor-pointer">
            {{ this.shown[1] }}
        </span>
        <span v-if="this.shown[2]" @click="useClue(2)"
            class="inline-flex items-center px-2 m-1 rounded-md text-xs font-medium bg-gray-300 text-gray-800 cursor-pointer">
            {{ this.shown[2] }}
        </span>
        <span v-if="this.shown[3]" @click="useClue(3)"
            class="inline-flex items-center px-2 m-1 rounded-md text-xs font-medium bg-gray-300 text-gray-800 cursor-pointer">
            {{ this.shown[3] }}
        </span>
    </div>
</template>
<script>
import { loadList } from '@/api'
export default {
    data() {
        return {
            shown: [],
            clues: [],
        }
    },
    props: {
        ticker: {
            type: String,
            required: true
        }
    },
    mounted() {
        this.clues = loadList()
    },
    methods: {
        showClues() {
            if (this.ticker) {
                let input = this.ticker.toUpperCase()
                this.shown = this.clues.filter(symbol => symbol.includes(input))
            }
        },
        resetClues() {
            if (!this.ticker) {
                this.shown = []
            }
        },
        useClue(key) {
            this.ticker = this.shown[key]
            this.add()
            this.showClues()
            if (this.exists === false) {
                this.shown = []
            }
        },
    }
}
</script>
