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
        reqired: false
      },
    },

    data() {
        return { 
          ticker: '',
          datatext: '',
          exists: false
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
        directAdd() {
          this.handleAdd(this.ticker)
        },
        handleAdd(ticker) {
          this.$emit('add-method', ticker)
          this.ticker = ''
          this.$refs.displayCluesRef.resetClues()
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