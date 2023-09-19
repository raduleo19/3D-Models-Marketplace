<template>
    <section class="py-5 text-center container d-flex flex-column" style="height: calc(100vh - 60px);">
        <div class="row">
            <div class="col-lg-6 col-md-8 mx-auto">
                <h1 class="fw-light">Your Cart</h1>
            </div>
        </div>

        <div class="row flex-grow-1 overflow-auto mt-4">
            <CartItem v-for="product in this.useUser.cart" :product="product" />
        </div>

        <div class="row mt-auto mb-3">
            <h3>Total Price: {{ totalPrice }}$</h3>
            <button class="btn btn-lg btn-success btn-block mt-3" type="submit"
                v-on:click.prevent="handleOrder">Order!</button>

            <button class="btn btn-lg btn-danger btn-block mt-3" type="submit" v-on:click.prevent="handleClear">Clear
                Cart!</button>
        </div>
    </section>
</template>

<script>
import axios from 'axios';
import { useUserStore } from '../../stores/UserStore';
import CartItem from './CartItem.vue'

export default {
    name: "CartPage",
    components: {
        CartItem
    },
    data() {
        return {
            useUser: useUserStore(),
        }
    },
    methods: {
        handleOrder() {
            let order = {
                products: this.useUser.cart.map(product => {
                    return {
                        id: product._id,
                        name: product.name,
                        price: product.price,
                        img: product.images[0],
                    };
                }),
                total: this.totalPrice
            };

            if (this.useUser.userData.balance < order.total) {
                alert("Not enough money!");
                return;
            }

            axios.post('http://localhost:8000/api/orders', order, { headers: { "Authorization": `Bearer ${this.useUser.token}` } }).then(response => {
                if (response.status == 200) {
                    this.useUser.userData.balance -= order.total;
                    this.useUser.cart = [];
                    alert("Order successful!");
                }
            }).catch(error => {
                console.log(error);
                alert("Error!");
            });
        },
        handleClear() {
            this.useUser.cart = [];
        }
    },
    computed: {
        totalPrice() {
            var priceAdder = (total, current) => {
                return total + current.price;
            };

            return this.useUser.cart.reduce(priceAdder, 0);
        }
    }
};
</script>

<style>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css');

.section-products {
    padding: 80px 0 54px;
}

.section-products .header {
    margin-bottom: 50px;
}

.section-products .header h2 {
    font-size: 2.2rem;
    font-weight: 400;
    color: #444444;
}
</style>