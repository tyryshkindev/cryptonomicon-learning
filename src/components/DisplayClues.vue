<template>
    <div v-if="shown.length" class="flex bg-white p-1 rounded-md shadow-md flex-wrap">
        <span v-if="shown[0]" @click="clickClue(0)"
            class="inline-flex items-center px-2 m-1 rounded-md text-xs font-medium bg-gray-300 text-gray-800 cursor-pointer">
            {{ shown[0] }}
        </span>
        <span v-if="shown[1]" @click="clickClue(1)"
            class="inline-flex items-center px-2 m-1 rounded-md text-xs font-medium bg-gray-300 text-gray-800 cursor-pointer">
            {{ shown[1] }}
        </span>
        <span v-if="shown[2]" @click="clickClue(2)"
            class="inline-flex items-center px-2 m-1 rounded-md text-xs font-medium bg-gray-300 text-gray-800 cursor-pointer">
            {{ shown[2] }}
        </span>
        <span v-if="shown[3]" @click="clickClue(3)"
            class="inline-flex items-center px-2 m-1 rounded-md text-xs font-medium bg-gray-300 text-gray-800 cursor-pointer">
            {{ shown[3] }}
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
        showClues() {
            if (this.datatext && this.clues !== []) {
                let input = this.datatext.toUpperCase()
                this.shown = this.clues.filter(symbol => symbol.includes(input))
            }
        },
        resetClues() {
            if (!this.datatext) {
                this.shown = []
            }
        },
        clickClue(key) {
            console.log('use!');
            this.add(this.shown[key])
            console.log('add');
            this.showClues()
            console.log('clues')
            if (this.exists === false) {
                this.shown = []
            }
        },
    }
}
</script>
