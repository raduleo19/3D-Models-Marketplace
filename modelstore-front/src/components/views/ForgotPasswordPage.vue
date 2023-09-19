<template>
    <div class="col-md-8 col-lg-7 col-xl-5 col-xxl-4 bg-light p-5 rounded mx-auto mt-md-5">
        <form class="form-signin" @submit.prevent="handleSubmit">
            <h1 class="h3 mb-3">Forgot Password?</h1>

            <div class="form-group mb-3">
                <label class="form-label" for="inputEmail">Email address</label>
                <input type="email" id="inputEmail" class="form-control mt-1" v-model="email" placeholder="Email address"
                    required autofocus>
            </div>

            <div class="d-grid gap-2 col-6 mx-auto">
                <button class="btn col-6 btn-primary mx-auto" type="submit">Send reset link</button>
            </div>
        </form>
    </div>
</template>

<script>
import axios from 'axios';
import { useUserStore } from '../../stores/UserStore'

export default {
    name: "ForgotPasswordPage",
    data() {
        return {
            useUser: useUserStore(),
            email: "",
        }
    },
    methods: {
        handleSubmit() {
            const data = {
                email: this.email,
            };

            axios.post('http://localhost:8000/api/users/forgot', data)
                .then(response => {
                    console.log(response.data)
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }

};
</script>