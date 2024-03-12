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
              @keydown.enter="directAdd"
              @input="handleInput"
              type="text"
              name="wallet"
              id="wallet"
              class="block w-full pr-10 border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
              placeholder="Например DOGE"
            />
          </div>
          <DisplayClues 
          ref="displayCluesRef"
          :datatext="datatext"
          @add-method="handleAdd"
          @ticker-changed="changeTicker"
          />
          <div v-if="exists" class="text-sm text-red-600">Такой тикер уже добавлен</div>
        </div>
      </div>
      <AddButton
        @click="handleAdd"
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

    props: {
      exists: {
        type: Boolean,
        required: true
      },
    },

    data() {
        return { 
          ticker: '',
          datatext: '',
        }
    },

    watch: {
      ticker() {
        this.datatext = this.ticker
      },
      datatext() {
        if (this.datatext !== this.ticker) {
          this.ticker = this.datatext
        }
      }
    },

    methods: {
        changeTicker(newValue) {
          this.ticker = newValue
        },
        directAdd() {
          this.handleAdd(this.ticker)
        },
        async handleAdd(newTicker) {
          await this.$emit('add-method', newTicker)
          if (this.exists === false) {
            this.ticker = ''
            this.$refs.displayCluesRef.resetClues()
          } else {
            this.ticker = newTicker
            this.$refs.displayCluesRef.showClues(newTicker)
          }
        },
        handleInput() {
          this.resetExists()
          this.$refs.displayCluesRef.showClues(this.datatext)
          this.$refs.displayCluesRef.resetClues(this.datatext)
        },
        resetExists() {
          this.existsChanged(false)
        },
        existsChanged(newValue) {
          this.$emit('exists-changed', newValue)
        },
    }
}
</script>