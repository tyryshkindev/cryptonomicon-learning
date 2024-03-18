<template>
    <div v-if="shown.length" class="flex bg-white p-1 rounded-md shadow-md flex-wrap">
        <span 
        v-for="(clue, index) in shown" 
        :key="clue + 'value'"
        @click="clickClue(index)"
        v-show="index < 4"
            class="inline-flex items-center px-2 m-1 rounded-md text-xs font-medium bg-gray-300 text-gray-800 cursor-pointer">
            {{ clue }}
        </span> 
    </div>
</template>
<script>
import { loadList } from '@/api'
export default {
    props: {
        datatext: {
            type: String,
            required: true
        }
    },
    watch: {
        datatext(newValue) {
            if (newValue?.length) {
                this.showClues(newValue)
                return
            } this.resetClues(newValue)
        }
    },
    data() {
        return {
            shown: [],
            clues: [],
        }
    },
    created() {
        this.clues = loadList()
    },
    methods: {
        showClues(value) {
            if (value && this.clues !== []) {
                this.shown = this.clues.filter(symbol => symbol.includes(value.toUpperCase()))
            }
        },
        resetClues(data) {
            if (!data) {
                this.shown = []
            }
        },
        clickClue(key) {
            this.$emit('add-method', this.shown[key])
        },
    }
}
</script>
