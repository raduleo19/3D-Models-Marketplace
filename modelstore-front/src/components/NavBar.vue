<template>
    <!-- Bootstrap Navbar with Login and Signup -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">

        <div class="container-fluid">
            <RouterLink class="navbar-brand" to="/">Modelstore</RouterLink>

            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <RouterLink class="nav-link" to="/products">Store</RouterLink>
                    </li>
                </ul>

                <ul class="navbar-nav ms-auto">
                    <template v-if="this.token">
                        <li>
                            <RouterLink class="nav-link" to="/balance">Balance: {{ userData.balance }}$</RouterLink>
                        </li>

                        <li>
                            <RouterLink class="nav-link" to="/publish">Publish</RouterLink>
                        </li>
                        <li>
                            <div class="dropdown">

                                <button class="nav-link dropdown-toggle" type="button" id="dropdownMenuButton"
                                    data-toggle="dropdown" data-bs-toggle="dropdown" aria-haspopup="true"
                                    aria-expanded="false">
                                    Hello, {{ userData.name }}
                                </button>
                                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">

                                    <RouterLink class="dropdown-item" to="/cart">Cart</RouterLink>
                                    <RouterLink class="dropdown-item" to="/profile">Profile</RouterLink>
                                    <RouterLink class="dropdown-item" to="/orders">Orders</RouterLink>
                                    <RouterLink class="dropdown-item" to="/publications">Your Creations</RouterLink>
                                    <button class="dropdown-item" v-on:click="logout">Logout</button>
                                </div>
                            </div>
                        </li>
                    </template>
                    <template v-else>
                        <li>
                            <RouterLink class="nav-link" to="/login">Login</RouterLink>
                        </li>
                        <li>
                            <RouterLink class="nav-link" to="/register">Register</RouterLink>
                        </li>
                    </template>
                </ul>
            </div>
        </div>

    </nav>
</template>

<script>
import { mapState } from 'pinia'
import { useUserStore } from '../stores/UserStore';

export default {
    name: "NavBar",
    data() {
        return {
            useUser: useUserStore(),
        }
    },
    methods: {
        logout() {
            this.useUser.token = null;
            this.useUser.isAdmin = false;
            this.$router.push('/login');
        }
    },
    computed: {
        ...mapState(useUserStore, ['token']),
        ...mapState(useUserStore, ['userData']),
        ...mapState(useUserStore, ['type'])
    }
};
</script>