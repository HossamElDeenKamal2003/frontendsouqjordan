<template>
  <div v-if="isOpen" class="bottom-sheet-overlay">
    <div class="bottom-sheet">
      <div class="bottom-sheet-header">
        <h3>{{ title || 'Filter' }}</h3>
        <button class="close-button" @click="close">✕</button>
      </div>
      <div class="bottom-sheet-content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BottomSheetFilter',
  props: {
    isOpen: { type: Boolean, default: false },
    title: { type: String, default: '' },
  },
  methods: {
    close() {
      this.$emit('close');
    },
  },
};
</script>

<style scoped>
.bottom-sheet-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: flex-end;
}
.bottom-sheet {
  background-color: white;
  width: 100%;
  max-width: 600px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  padding: 20px;
  max-height: 80vh;
  overflow-y: auto;
}
.bottom-sheet-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}
.close-button {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}
.bottom-sheet-content {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
</style>