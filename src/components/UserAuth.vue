<template>
<v-app>
  <v-container fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm6 offset-sm2>
        <v-card height="350" width="400">
          <v-card-title primary-title>
            <v-layout align-center justify-center>
              <v-flex>
                <v-btn icon flat>
                  <img src="@/assets/laptop.svg" alt="laptop" width="60" height="60">
                </v-btn>
              </v-flex>
            </v-layout>
          </v-card-title>
          <v-container grid-list-md text-xs-center>
            <v-layout row wrap>
              <v-flex xs1></v-flex>
              <v-flex xs10>
                <v-form @submit.prevent="signIn">
                  <v-text-field prepend-icon="person" class="input-group--focused" label="Username" v-model="username"></v-text-field>
                  <v-text-field  prepend-icon="lock" class="input-group--focused" label="Password" v-model="password" type="password"></v-text-field>
                </v-form>
              </v-flex>
              <v-flex xs1></v-flex>
            </v-layout>
          </v-container>
          <v-container grid-list-md text-xs-center>
            <v-layout>
              <v-flex xs1></v-flex>
              <v-flex xs3></v-flex>
              <v-flex xs3></v-flex>
              <v-card-actions>
                <v-btn color='primary' :loading="loading" @click="signIn" @click.native="loader = 'loading'" :disabled="loading">
                  SIGN IN <v-icon right>account_circle</v-icon>
                </v-btn>
              </v-card-actions>
              <v-flex xs1></v-flex>
            </v-layout>
          </v-container>

        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</v-app>
</template>





<script>
const j = window.jQuery // JQuery

export default {

  data: () => ({
    loading: false,
    username: '',
    password: '',
  }),

  props: {
    source: String
  },

  watch: {
    // loader() {
    //   const l = this.loader
    //   this[l] = !this[l]
    //
    //   setTimeout(() => (this[l] = false), 3000)
    //
    //   this.loader = null
    // }
  },

  methods: {
    signUp() {
      console.log(this.$data)
      j.post('http://localhost:8000/auth/users/create/', this.$data, (data) => {
          alert("Your account has been created. You will be signed in automatically")
          this.signIn()
        })
        .fail((response) => {
          alert(response.responseText)
        })
    },

    signIn() {
      this.loading = true
      const credentials = {
        username: this.username,
        password: this.password
      }

      j.post('http://localhost:8000/auth/token/create/', credentials, (data) => {
          sessionStorage.setItem('authToken', data.auth_token)
          sessionStorage.setItem('username', this.username)
          this.$router.push('/chats/')
        })
        .fail((response) => {
          alert(response.responseText)
        })
        this.loading = false
    }
  }
}
</script>
<style>
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}

@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}

@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}

@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
