<script>
import axios from 'axios';

export default {
  name: 'CheckAbilitaddPost',
  props: {
    userId: {
      type: String,
      default: () => localStorage.getItem('userId')
    }
  },
  emits: ['checked'],
  async mounted() {
    try {
      const response = await axios.post('https://backend.jordan-souq.com/product/check-add-post', {
        userId: this.userId
      });
      this.$emit('checked', {
        canAdd: response.data.canUpdate,
        message: response.data.message
      });
    } catch (error) {
      // If backend sent a response, use its message
      if (error.response && error.response.data) {
        this.$emit('checked', {
          canAdd: false,
          message: error.response.data.message || 'Response error, please try again later.'
        });
      } else {
        this.$emit('checked', {
          canAdd: false,
          message: 'Response error, please try again later.'
        });
      }
    }
  }
}
</script>