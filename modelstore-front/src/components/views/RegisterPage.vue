<template>
    <div class="col-md-8 col-lg-7 col-xl-5 col-xxl-3 bg-light p-5 rounded mx-auto mt-md-5">
        <form class="form-signin" @submit.prevent="handleSubmit">
            <h1 class="h3 mb-3">Register</h1>

            <div class="form-group mb-3">
                <label class="form-label" for="inputName">Name</label>
                <input type="text" id="inputName" class="form-control mt-1" v-model="name" placeholder="Name" required
                    autofocus>
            </div>

            <div class="form-group mb-3">
                <label class="form-label" for="inputEmail">Email address</label>
                <input type="email" id="inputEmail" class="form-control mt-1" v-model="email" placeholder="Email address"
                    required autofocus>
            </div>


            <div class="form-group mb-3">
                <label class="form-label" for="inputPassword">Password</label>
                <input type="password" id="inputPassword" class="form-control mt-1" v-model="password"
                    placeholder="Password" required>
            </div>

            <div class="form-group mb-3">
                <label class="form-label" for="inputConfPassword">Confirm Password</label>
                <input type="password" id="inputConfPassword" class="form-control mt-1" v-model="confirm_password"
                    placeholder="Password" required>
            </div>

            <div class="form-group mb-3">
                <label class="form-label" for="inputPhone">Phone Number</label>
                <input type="text" id="inputPhone" class="form-control mt-1" v-model="phone" placeholder="Phone Number"
                    required>
            </div>


            <div class="form-group mb-4">
                <label class="form-label" for="inputAddress">Address</label>
                <input type="text" id="inputAddress" class="form-control mt-1" v-model="address" placeholder="Address"
                    required>
            </div>

            <div class="d-grid gap-2 col-6 mx-auto">
                <button class="btn col-6 btn-primary mx-auto" type="submit">Register</button>
            </div>
        </form>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: "RegisterPage",
    data() {
        return {
            name: "",
            email: "",
            confirm_password: "",
            password: "",
            phone: "",
            address: "",
        }
    },
    methods: {
        handleSubmit() {
            if (this.password != this.confirm_password) {
                alert("Password and Confirm Password must be same");
                return;
            }

            const data = {
                name: this.name,
                email: this.email,
                password: this.password,
                phone: this.phone,
                address: this.address,
            };

            axios.post('http://localhost:8000/api/users', data)
                .then((response) => {
                    console.log(response);
                    this.$router.push('/login');
                    alert("Register Success!");
                })
                .catch(error => {
                    console.log(error);
                });
        },
    },
};
</script>