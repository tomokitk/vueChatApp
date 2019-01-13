 <template>
  <div id="app">
    <header class="header">
      <h1>Chat</h1>
     <div v-if="user.uid" key="login">
        login as {{ user.displayName }}
        <span><a href="" @click="doLogout">ログアウト</a></span>
      </div>
    </header>
    <!--Firebaseから取得したリストを描画(トランジション付き)-->
    <transition-group name="chat" tag="div" class="list content">
      <section v-for="{ key, name, image, message } in chat" :key="key" class="item">
        <div v-if="image != user.photoURL" class="item-image"><img :src="image" width="40" height="40"></div>
        <div class="item-detail"  v-bind:class="{auth : image == user.photoURL}">
          <div class="item-name" v-bind:class="{auth : image == user.photoURL}">{{ name }}</div>
          <div class="item-message" v-bind:class="{auth : image == user.photoURL}">
            <nl2br tag="div" :text="message"/>
          </div>
        </div>
      </section>
    </transition-group>
    <!--入力フォーム-->
    <form action="" @submit.prevent="doSend" class="form">
      <textarea
        v-model="input"
        :disabled="!user.uid"></textarea>
      <button type="submit" :disabled="!user.uid" class="send-button" v-on:click.prevent="doSend">送信</button>
    </form>
  </div>
</template>

<script>
import firebase from 'firebase'
// 改行を <br> タグに変換するモジュール
import Nl2br from 'vue-nl2br'
export default {
  components: { Nl2br },
  name: 'chat',
  props: ['name'],
  data () {
    return {
      user: {}, // ユーザー情報
      chat: [], // 取得したメッセージを入れる配列
      input: '' // 入力したメッセージ
    }
  },
  created () {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.user = user
      } else {
        this.user = {}
      }
      console.log(this.user)
      const refMessage = firebase.database().ref('message')
      if (user) {
        this.chat = []
        // message 以下に追加情報があった際に追加
        refMessage.on('child_added', this.childAdded)
      } else {
        // message に変更があったときのハンドラを解除
        refMessage.off('child_added', this.childAdded)
      }
    })
  },
  methods: {
    // ログアウト処理
    doLogout () {
      firebase.auth().signOut()
      this.$router.push({name: 'welcome'})
    },
    // スクロール位置を一番下に移動
    scrollBottom () {
      this.$nextTick(() => {
        window.scrollTo(0, document.body.clientHeight)
      })
    },
    // 受け取ったメッセージをchatに追加
    // データベースに新しい要素が追加されると随時呼び出される
    // snapにデータベースの内容が入ってきている
    childAdded (snap) {
      const message = snap.val()
      console.log('dddd')
      console.log(message)
      this.chat.push({
        key: snap.key,
        name: message.name,
        image: message.image,
        message: message.message
      })
      this.scrollBottom()
    },
    doSend () {
      if (this.user.uid && this.input.length) {
        // firebase にメッセージを追加
        firebase.database().ref('message').push({
          message: this.input,
          name: this.user.displayName,
          image: this.user.photoURL
        }, () => {
          this.input = '' // フォームを空にする
        })
      }
    }
  }
}
</script>
<style>
* {
  margin: 0;
  box-sizing: border-box;
}
.header {
  background: #3ab383;
  margin-bottom: 1em;
  padding: 0.4em 0.8em;
  color: #fff;
}
.content {
  margin: 0 auto;
  padding: 0 10px;
  max-width: 600px;
}
.form {
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  bottom: 0;
  height: 80px;
  width: 100%;
  background: #f5f5f5;
}
.form textarea {
  border: 1px solid #ccc;
  border-radius: 2px;
  height: 4em;
  width: calc(100% - 6em);
  resize: none;
}
.list {
  margin-bottom: 100px;
}
.item {
  position: relative;
  display: flex;
  align-items: flex-end;
  margin-bottom: 0.8em;
}
.item-image img {
  border-radius: 20px;
  vertical-align: top;
}
.item-detail {
  margin: 0 0 0 1.4em;
}
.item-detail.auth {
  margin: 0 0 0 30em;
}
.item-name {
  font-size: 75%;
}
.item-message {
  position: relative;
  display: inline-block;
  padding: 0.8em;
  background: #dcdee2;
  border-radius: 4px;
  line-height: 1.2em;
}
.item-message::before {
  position: absolute;
  content: " ";
  display: block;
  left: -16px;
  bottom: 12px;
  border: 4px solid transparent;
  border-right: 12px solid #dcdee2;
}
.item-message.auth {
  position: relative;
  display: inline-block;
  padding: 0.8em;
  background: #bef4cf;
  border-radius: 4px;
  line-height: 1.2em;
}
.item-message.auth::before {
  display: none;
}
a {
  color: #ffffff;
  position: relative;
  margin: 0 0 0 80%;
}

.send-button {
  height: 4em;
}
/* トランジション用スタイル */
.chat-enter-active {
  transition: all 1s;
}
.chat-enter {
  opacity: 0;
  transform: translateX(-1em);
}
@media screen and (max-width: 768px){
  .item-detail.auth {
    margin: 0 0 0 18em;
}
  a {
      color: #fff;
      position: relative;
      margin: 0 0 0 45%;
  }
}

</style>
