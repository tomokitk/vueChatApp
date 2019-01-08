<template>
  <div class="welcome container">
    <div class=card>
     <div class="card-content center-align">
      <div class="teal-text">login</div>
        <div>google アカウントが必須です</div>
        <button type="button" @click="doLogin" class="btn teal">ログイン</button>
     </div>
    </div>
  </div>
</template>
<script>
import firebase from 'firebase'
export default {
  name: 'welcome',
  data () {
    return {
      name: null,
      feedback: null
    }
  },
  methods: {
    doLogin () {
      const provider = new firebase.auth.GoogleAuthProvider()
      firebase.auth().signInWithPopup(provider)
      this.$router.push({name: 'chat', params: { name: this.name }})
        .catch(error => alert('🤕' + error.message))
        .then(data => console.log(data.user, data.credential.accessToken))
    }
  }
}
</script>
<style>
.welcome{
  max-width:400px;
  margin-top:100px;
}
.welcome button{
  margin:30px auto;
}
</style>
