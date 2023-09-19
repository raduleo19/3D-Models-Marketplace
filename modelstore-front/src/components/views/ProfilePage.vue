<template>
    <template v-if="this.loading">
        <div class="container-fluid d-flex align-items-center justify-content-center"
            style="min-height: calc(100vh - 54px);">
            <scaling-squares-spinner :animation-duration="1250" :size="65" color="#ff1d5e" />
        </div>
    </template>
    <template v-else>
        <div class="col-md-6 col-lg-5 col-xl-4 bg-light p-5 rounded mx-auto mt-md-5">
            <form class="form-signin" @submit.prevent="handleSubmit">
                <h1 class="h3">Profile</h1>

                <div class="form-group mb-3">
                    <label class="form-label" for="inputName">Name</label>
                    <input type="text" id="inputName" class="form-control mt-1" v-model="name" placeholder="Name" required
                        autofocus>
                </div>

                <div class="form-group mb-3">
                    <label class="form-label" for="inputEmail">Email address</label>
                    <input type="email" id="inputEmail" class="form-control mt-1" v-model="email">

                </div>

                <div class="form-group mb-3">
                    <label class="form-label" for="inputPassword">New Password</label>
                    <input type="password" id="inputPassword" class="form-control mt-1" v-model="password"
                        placeholder="Password">
                </div>

                <div class="form-group mb-3">
                    <label class="form-label" for="inputConfPassword">Confirm New Password</label>
                    <input type="password" id="inputConfPassword" class="form-control mt-1" v-model="confirm_password"
                        placeholder="Password">

                </div>

                <div class="form-group mb-3">
                    <label class="form-label" for="inputPhone">Phone Number</label>
                    <input type="text" id="inputPhone" class="form-control mt-1" v-model="phone" placeholder="Phone Number"
                        required>

                </div>

                <div class="form-group mb-5">
                    <label class="form-label" for="inputAddress">Address</label>
                    <input type="text" id="inputAddress" class="form-control mt-1" v-model="address" placeholder="Address"
                        required>
                </div>

                <div class="d-grid gap-2 d-md-flex justify-content-md-center">
                    <button class="btn col-5 btn-primary btn-block" type="submit">Update Profile</button>
                    <button class="btn col-5 btn-danger btn-block" v-on:click.prevent="handleDelete">Delete
                        user</button>
                </div>


            </form>
        </div>
    </template>
</template>

<script>
import { ScalingSquaresSpinner } from 'epic-spinners'
import axios from 'axios';
import { useUserStore } from '../../stores/UserStore';

export default {
    name: "ProfilePage",
    components: {
        ScalingSquaresSpinner
    },
    data() {
        return {
            useUser: useUserStore(),
            name: "",
            email: "",
            confirm_password: "",
            password: "",
            phone: "",
            address: "",
            loading: 1,
        }
    },
    mounted() {
        axios.get('http://localhost:8000/api/users/profile', { headers: { "Authorization": `Bearer ${this.useUser.token}` } })
            .then((response) => {
                console.log(response);
                this.email = response.data.email;
                this.name = response.data.name;
                this.phone = response.data.phone;
                this.address = response.data.address;
                this.loading = 0;
            })
            .catch(error => {
                console.log(error);
            });
    },
    methods: {
        handleSubmit() {
            const data = {
                name: this.name,
                phone: this.phone,
                address: this.address,
                email: this.email,
            };

            if (this.password != "") {
                if (this.password == this.confirm_password) {
                    data["password"] = this.password;
                } else {
                    alert("Password and Confirm Password must be same");
                }
            }

            this.useUser.userData.email = this.email;
            this.useUser.userData.name = this.name;
            this.useUser.userData.phone = this.phone;
            this.useUser.userData.address = this.address;
            
            axios.put('http://localhost:8000/api/users', data, { headers: { "Authorization": `Bearer ${this.useUser.token}` } })
                .then((response) => {
                    console.log(response);
                    alert("Profile Updated");
                })
                .catch(error => {
                    console.log(error);
                });
        },
        handleDelete() {
            axios.delete('http://localhost:8000/api/users', { headers: { "Authorization": `Bearer ${this.useUser.token}` } })
                .then((response) => {
                    console.log(response);
                    this.useUser.token = null;
                    this.useUser.isAdmin = false;
                    this.useUser.cart = [];
                    this.$router.push('/login');
                })
                .catch(error => {
                    console.log(error);
                });
        }
    },
};
</script>