<template>
    <div class="col-md-6 col-lg-4 col-xl-4 col-xxl-3">
        <div class="card product-card shadow mb-5 bg-body rounded-0" style="width: 18rem;">
            <div class="position-relative">
                <img :src="product.images[0]" class="card-img-top product-img" alt="product image"
                    style="height: 250px; object-fit: contain;">
                <div class="price-badge position-absolute top-0 end-0 bg-primary text-white p-2">
                    <h5>{{ product.price }}$</h5>
                </div>
            </div>
            <div class="card-body">
                <h5 class="card-title">{{ product.name }}</h5>
                <p><small class="text-muted">by {{ product.publisher.name }}</small></p>
                <div class="mb-2">
                    <p class="mb-1 text-start"><small>Downloads: {{ product.downloads }}</small></p>
                    <p class="text-start"><small>Rating: {{ product.rating }}</small></p>
                </div>
                <button v-on:click.prevent="addToCart" class="btn btn-success w-100 rounded-0 mb-2">Add to Cart</button>
                <a v-bind:href="'/product/' + product._id" class="btn btn-primary w-100 rounded-0">Details</a>
            </div>
        </div>
    </div>
</template>

<script>
import { useUserStore } from '../../stores/UserStore';
export default {
    name: "ProductItem",
    data() {
        return {
            useUser: useUserStore(),
        }
    },
    props: {
        product: Object
    },
    methods: {
        addToCart() {
            if (this.useUser.token == null) {
                this.$router.push('/login');
            } else {
                var contains = this.useUser.cart.some(elem => {
                    return JSON.stringify(this.product) === JSON.stringify(elem);
                });

                if (contains) {
                    console.log("Already in cart");
                } else {
                    this.useUser.cart.push(this.product);
                }
            }
        }
    }
};
</script>

<style>
.card.product-card {
    border: none;
    transition: transform .3s;
}

.card.product-card:hover {
    transform: scale(1.02);
    box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.2);
}

body {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-family: 'Poppins', sans-serif;
    background-color: #f8f9fa;
}
</style>