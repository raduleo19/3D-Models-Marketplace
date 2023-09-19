<template>
    <div class="col-md-8 col-lg-7 col-xl-5 col-xxl-4 bg-light p-5 rounded mx-auto mt-md-5">
        <form class="form-signin" @submit.prevent="handleSubmit">
            <h1 class="h3 mb-3">Login</h1>

            <div class="form-group mb-3">
                <label class="form-label" for="inputEmail">Email address</label>
                <input type="email" id="inputEmail" class="form-control mt-1" v-model="email" placeholder="Email address"
                    required autofocus>
                <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone
                    else.</small>
            </div>

            <div class="form-group mb-3">
                <label class="form-label" for="inputPassword">Password</label>
                <input type="password" id="inputPassword" class="form-control mt-1" v-model="password"
                    placeholder="Password" required>
            </div>


            <div class="mb-3">
                <RouterLink to="/forgot-password">Forgot Password?</RouterLink>
            </div>

            <div class="d-grid gap-2 col-6 mx-auto">
                <button class="btn col-6 btn-primary mx-auto" type="submit">Login</button>
            </div>


        </form>
    </div>
</template>

<script>
import axios from 'axios';
import { useUserStore } from '../../stores/UserStore'

export default {
    name: "LoginPage",
    data() {
        return {
            useUser: useUserStore(),
            email: "",
            password: "",
        }
    },
    methods: {
        handleSubmit() {
            const data = {
                email: this.email,
                password: this.password,
            };

            axios.post('http://localhost:8000/api/users/login', data)
                .then(response => {
                    if (response.data.status == "success") {
                        this.useUser.userData = response.data.userData;
                        this.useUser.token = response.data.token;
                        this.$router.push({ name: 'home' });
                    } else {
                        alert("Login failed");
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }

};
</script>