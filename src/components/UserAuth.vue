<template>
   <!-- <div class="md-size-200 md-size-200"> -->
      <div class="md-layout">
        <div class="md-layout-item"></div>
        <md-tabs>
          <md-tab id="tab-signin" md-label="Sign in">
         <form novalidate class="md-layout-item md-size-200" @submit.prevent="signIn">
            <md-card class="md-layout-item">
               <md-card-content>
               <md-field md-clearable>
                  <md-icon>account_circle</md-icon>
                  <label class="md-inline">Username</label>
                  <md-input v-model="username"></md-input>
               </md-field>
               <md-field>
                  <md-icon>lock</md-icon>
                  <label>Password</label>
                  <md-input v-model="password" type="password"></md-input>
               </md-field>
               <md-card-actions>
                  <md-button type="submit" class="md-primary">Sign In</md-button>
               </md-card-actions>
             </md-card-content>
            </md-card>

         </form>
       </md-tab>
       <md-tab id="tab-signup" md-label="Sign up">
         <form novalidate class="md-layout-item" @submit.prevent="signUp">
            <md-card class="md-layout-item">
               <md-card-content>
               <md-field md-clearable>
                  <md-icon>account_circle</md-icon>
                  <label class="md-inline">Username</label>
                  <md-input v-model="username"></md-input>
               </md-field>
               <md-field>
                  <md-icon>lock</md-icon>
                  <label>Password</label>
                  <md-input v-model="password" type="password"></md-input>
               </md-field>
               <md-field>
                  <md-icon>lock</md-icon>
                  <label>Repassword</label>
                  <md-input v-model="repassword" type="password"></md-input>
               </md-field>
               <md-card-actions>
                  <md-button type="submit" class="md-primary">Create user</md-button>
               </md-card-actions>
             </md-card-content>
            </md-card>

         </form>
       </md-tab>
       </md-tabs>
         <div class="md-layout-item"></div>
      </div>
   <!-- </div> -->
</template>

<script>
   const j = window.jQuery // JQuery

   export default {

     data() {
       return {
         email: '',
         username: '',
         password: '',
         repassword: '',
       }
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
       }
     }
   }
</script>
<style lang="scss" scoped>
    @import "~vue-material/dist/theme/engine"; // Import the theme engine

    @include md-register-theme("default", (
      primary: md-get-palette-color(red, A200), // The primary color of your application
      accent: md-get-palette-color(blue, A200), // The accent or secondary color
      theme: light // This can be dark or light
    ));

    @import "~vue-material/dist/theme/all";

   .md-progress-bar {
   position: absolute;
   top: 0;
   right: 0;
   left: 0;
   }
</style>
