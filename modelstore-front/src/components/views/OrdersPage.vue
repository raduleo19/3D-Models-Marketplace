<template>
    <section class="py-5 text-center container m-auto">
        <div class="row py-lg-5">
            <h1 class="fw-light">Orders</h1>
        </div>

        <div class="row row-cols-1 row row-cols-sm-2 row-cols-md-3 row-cols-lg-4  row-cols-xl-7 mt-5">
            <div v-for="order in orders" class="col mb-4 ">
                <div class="card text-white bg-primary mb-3 m-auto" style="max-width: 25rem;">
                    <div class="card-header">Order Id: {{ order._id }}</div>

                    <div class="card-body">
                        <p class="card-text">Date: {{ new Date(order.date).toLocaleString('ro-RO')}} </p>
                    </div>

                    <ul class="list-group list-group-flush">
                        <li v-for="product in order.products" class="list-group-item">
                            <img class="card-img-top" :src="product.img"
                                style="width: 100px;height: 100px; object-fit: cover; object-position: left;">
                            <div> Product: {{ product.name }}</div>
                            <span> Price: ${{ product.price }}</span>
                        </li>
                    </ul>

                    <div class="card-footer bg-success">
                        <p class="card-text">Total: {{ order.total }}</p>
                        <p class="card-text">Status: {{ order.status }}</p>
                    </div>
                </div>
            </div>
        </div>

    </section>
</template>

<script>
import { useUserStore } from '../../stores/UserStore';
import axios from 'axios';
export default {
    name: "OrdersPage",
    data() {
        return {
            orders: null,
            useUser: useUserStore()
        }
    },
    mounted() {
        axios.get('http://localhost:8000/api/orders', { headers: { "Authorization": `Bearer ${this.useUser.token}` } }).then(response => {
            this.orders = response.data;
            console.log(this.orders);
        }).catch(error => {
            console.log(error);
        });
    },
};
</script>