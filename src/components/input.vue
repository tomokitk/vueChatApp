<template>
  <div>
    <form action="" @submit.prevent="doSend" class="form">
      <textarea
        v-model="input"
        :disabled="!user.uid"
        @keydown.enter.exact.prevent="doSend"></textarea>
      <button type="submit" :disabled="!user.uid" class="send-button">Send</button>
    </form>
  </div>
</template>
<script>
export default {
  name: 'welcome',
  data () {
    return {
      name: null,
      feedback: null
    }
  },
  methods: {
    login () {
      if (this.name) {
        this.$router.push({name: 'chat', params: { name: this.name }})
      } else {
        this.feedback = 'put your pass'
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.welcome{
  max-width:400px;
  margin-top:100px;
}
.welcome button{
  margin:30px auto;
}
</style>
