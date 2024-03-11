<template>
    <section>
      <div class="flex">
        <div class="max-w-xs">
          <label for="wallet" class="block text-sm font-medium text-gray-700">
            Тикер
            </label>
          <div class="mt-1 relative rounded-md shadow-md">
            <input
              v-model="ticker"
              @keydown.enter="add"
              @input="handleInput"
              type="text"
              name="wallet"
              id="wallet"
              class="block w-full pr-10 border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
              placeholder="Например DOGE"
            />
          </div>
          <display-clues ref="displayCluesRef" :ticker="ticker"/>
          <div v-if="exists" class="text-sm text-red-600">Такой тикер уже добавлен</div>

        </div>
      </div>
      <add-button
        @click="add"
        type="button"
        class="my-4"
      />
    </section>
</template>
<script>
import AddButton from './AddButton.vue'
import DisplayClues from './DisplayClues.vue'
export default {
    components: {
        AddButton,
        DisplayClues,
    },

    data() {
        return { 
          ticker: '',
          exists: false
        }
    },

    props: {
      exists: {
        type: Boolean,
        reqired: false
      }
    },

    methods: {
        add() {
          this.ticker = ''      
          this.exists = true
          this.existsChanged()
        },
        handleInput() {
          this.resetExists()
          this.$refs.displayCluesRef.showClues()
          this.$refs.displayCluesRef.resetClues()
        },
        resetExists() {
          this.exists = false
          this.existsChanged()
        },
        existsChanged() {
          this.$emit('exists-changed', this.exists)
        },
    }
}
</script>