<template>
  <div class="center-message">
    <div class="message-box">{{ message }}</div>
  </div>
</template>

<script>
export default {
  name: 'DisplayAddPostAbility',
  props: {
    message: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
.center-message {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
}
.message-box {
  padding: 2rem 3rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  font-size: 1.3rem;
  text-align: center;
}
</style>