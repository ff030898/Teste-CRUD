<template>
    <div>
        <Toolbar></Toolbar>
        <div class="d-flex align-center justify-center" style="height: 100vh; margin: 0 50rem;">
            <v-sheet width="400" class="mx-auto">
                <v-form fast-fail @submit.prevent="login">
                    <h1>Bem vindo(a)</h1><br>
                    <v-text-field v-model="username" label="User Name"></v-text-field>

                    <v-text-field v-model="password" label="password"></v-text-field>
                    <p class="text-body-2 font-weight-regular">*Username: <b>Seu nome</b></p>
                    <p class="text-body-2 font-weight-regular">*Senha: <b>123</b></p>

                    <v-btn type="submit" color="primary" dark class="mb-2" block>Entrar</v-btn>

                </v-form>

            </v-sheet>
        </div>
    </div>

</template>

<script>

import Toolbar from '../components/Toolbar';
import Vue from 'vue'
import VueRouter from 'vue-router';


export default {
    name: 'Login',
    components: { Toolbar },
    data() {
        return {
            username: '',
            password: '',
        };
    },

    methods: {
        login() {
            if(this.username !== '' && this.password === '123') {
                localStorage.setItem('username', this.username)
                this.$router.push('/home');
            }else {
                alert('Preencha os campos corretamente')
            }
            
        },
    }

};

</script>