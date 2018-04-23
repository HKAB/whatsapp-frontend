<template>
<v-container fill-height>
  <!-- <div v-if="sessionStarted" id="chat-container" class="card"> -->
  <v-layout v-if="sessionStarted" align-center justify-center row wrap>
    <v-flex xs12 sm6 offset-sm1>
      <v-card>
        <v-card-title primary-title>
          <v-layout align-center justify-center>
            <v-flex>
              <h3 class="display-1">SECRET.FORGET</h3>
            </v-flex>
          </v-layout>
        </v-card-title>
        <v-layout>
          <v-flex xs1></v-flex>
          <v-flex xs10>
        <v-container class="message-container" style="max-height: 300px;overflow-x: hidden;" grid-list-md>
          <v-layout column>
            <v-container v-for="message in messages" :key="message.id">
            <template v-if="username === message.user.username">
          <v-layout row wrap>
            <v-flex xs1></v-flex>
            <v-flex xs6></v-flex>
            <v-flex xs4 >
                <v-layout>
                  <!-- <v-chip class="messagechip" color="blue" text-color="white"><div class="messagechip">{{ message.message }}</div></v-chip> -->
                  <div class="msg-sent"><p>{{ message.message }}</p></div>
                  <v-avatar size="40px" slot="activator">
                    <img src="@/assets/boy.svg">
                  </v-avatar>
                </v-layout>
                </v-flex>
                </v-layout>
            </template>
            <template v-else>
              <v-layout row wrap>
                <v-flex xs4 >
                    <v-layout>
                      <v-avatar size="40px" slot="activator">
                        <img src="@/assets/boy.svg">
                      </v-avatar>
                      <div class="msg-recv"><p>{{ message.message }}</p></div>
                    </v-layout>
                    </v-flex>
                    <v-flex xs2></v-flex>
                    <v-flex xs6></v-flex>
                    </v-layout>
            </template>
          </v-container>
          </v-layout>
        </v-container>
      <v-flex xs1></v-flex>
    </v-flex>
      </v-layout>
        <v-card-actions>
          <v-container grid-list-md text-xs-center>
            <v-layout row wrap>
              <v-flex xs1></v-flex>
              <v-text-field class="input-group--focused" id="message"></v-text-field>
              <v-btn flat icon color="black" @click="postMessage">
                <v-icon>send</v-icon>
              </v-btn>
              <v-flex xs1></v-flex>
            </v-layout>
          </v-container>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
  <!-- </div> -->

  <v-layout v-else>
    <v-container>
      <v-layout align-center justify-center>
        <h1 class="display-3">Welcome nerd!
        <img src="@/assets/user.svg" alt="user" width="45" height="45">
        </h1>
      </v-layout>
      <v-layout align-center justify-center>
        <h5 class="subheading">Why we use this? I dunno, just use :)</h5>
      </v-layout>
      <v-layout align-center justify-center>
        <v-btn v-on:click="startChatSession" class="btn-startchatsession" color="primary" dark>Let me out of this shit and chat
          <v-icon small right>far fa-meh</v-icon>
        </v-btn>
      </v-layout>
    </v-container>
  </v-layout>
  </div>
</v-container>
</template>

<script>
const $ = window.jQuery

export default {
  data() {
    return {
      sessionStarted: false,
      message: '',
      messages: []
    }
  },

  created() {
    this.username = sessionStorage.getItem('username')

    // Setup headers for all requests
    $.ajaxSetup({
      headers: {
        'Authorization': `Token ${sessionStorage.getItem('authToken')}`
      }
    })

    if (this.$route.params.uri) {
      this.joinChatSession()
    }

    this.connectToWebSocket()
    // setInterval(this.fetchChatSessionHistory, 3000)

  },

  methods: {
    startChatSession() {
      $.post('http://localhost:8000/api/chats/', (data) => {
          alert("A new session has been created you'll be redirected automatically")
          this.sessionStarted = true
          this.$router.push(`/chats/${data.uri}/`)
        })

        .fail((response) => {
          alert(response.responseText)
        })
    },

    postMessage(event) {
      const data = {
        message: document.getElementById("message").value,
      }
      $.post(`http://localhost:8000/api/chats/${this.$route.params.uri}/messages/`, data, (data) => {
          // this.messages.push(data)
          this.message = '' // clear the message after sending
          document.getElementById("message").value = ''
        })
        .fail((response) => {
          alert(response.responseText)
        })
    },

    joinChatSession() {
      const uri = this.$route.params.uri

      $.ajax({
        url: `http://localhost:8000/api/chats/${uri}/`,
        data: {
          username: this.username
        },
        type: 'PATCH',
        success: (data) => {
          const user = data.members.find((member) => member.username === this.username) // https://www.w3schools.com/jsref/jsref_find.asp Definitly complicate because i have never learn js :))
          if (user) {
            // The user belongs/has joined the session
            this.sessionStarted = true
            this.fetchChatSessionHistory()
          }
        }
      })
    },

    fetchChatSessionHistory() {
      $.get(`http://127.0.0.1:8000/api/chats/${this.$route.params.uri}/messages/`, (data) => {
        this.messages = data.messages
      })
    },

    connectToWebSocket() {
      const websocket = new WebSocket(`ws://localhost:8081/${this.$route.params.uri}`)
      websocket.onopen = this.onOpen
      websocket.onclose = this.onClose
      websocket.onmessage = this.onMessage
      websocket.onerror = this.onError
    },

    onOpen(event) {
      console.log('Connection opened.', event.data)
    },

    onClose(event) {
      console.log('Connection closed.', event.data)

      // Try and Reconnect after five seconds
      setTimeout(this.connectToWebSocket, 5000)
    },

    onMessage(event) {
      const message = JSON.parse(event.data)
      this.messages.push(message)
    },

    onError(event) {
      // alert('An error occured:', event.data)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

.btn {
  border-radius: 0 !important;
}

.card-footer input[type="text"] {
  background-color: #ffffff;
  color: #444444;
  padding: 7px;
  font-size: 13px;
  border: 2px solid #cccccc;
  width: 100%;
  height: 38px;
}

.card-header a {
  text-decoration: underline;
}

.card-body {
  background-color: #ddd;
}


.btn-startchatsession {
  margin-top: 15px;
}

.msg-sent {
  background-color: #2d67ff;
  color: #ffffff;
  word-break: break-word ;
  width: 300px;
  height: auto;
  padding: 1em;
  text-align: left;
  display: inline-block;
  border-radius: 10px;
  -webkit-border-radius: 15px;
  -moz-border-radius: 10px;
  margin-right: 10px;
}

.msg-recv {
  background-color: #BDBDBD;
  color: #ffffff;
  word-break: break-word ;
  width: 300px;
  height: auto;
  padding: 1em;
  text-align: left;
  margin-left: 10px;
  display: inline-block;
  border-radius: 10px;
  -webkit-border-radius: 15px;
  -moz-border-radius: 10px;
}

.message-container::-webkit-scrollbar {
    width: 8px;
}

.message-container.thin::-webkit-scrollbar {
    width: 2px;
}

::-webkit-scrollbar-track {
    border-radius: 10px;
    background: #eee;
}

::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: #888;
}
::-webkit-scrollbar-thumb:window-inactive {
    background: rgba(100,100,100,0.4);
}
</style>
