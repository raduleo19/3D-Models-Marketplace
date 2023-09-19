<template>
    <div class="card mb-3" style="max-width: 540px;">
        <div class="row g-0">
            <div class="col-md-5">
                <img :src="product.images[0]" class="product-img" alt="product image"
                    style="width: 230px; height: 230px; object-fit: cover;">
            </div>
            <div class="col-md-7">
                <div class="card-body">
                    <h5 class="card-title">{{ product.name }}</h5>
                    <p class="card-text"><small class="text-body-secondary">Upload date: {{ new Date(product.date).toLocaleString('ro-RO')}}</small></p>


                    <p class="card-text"> Price: {{ product.price }}$ | Downloads: {{ product.downloads }} | Rating: {{
                        product.rating }} | Earnings: {{product.earnings}}$</p>


                    <a v-bind:href="'/product/' + product._id" class="btn btn-primary rounded-0">Edit</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useUserStore } from '../../stores/UserStore';
export default {
    name: "PublicationItem",
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
                var exist = (x) => {
                    if (x.product == this.product) {
                        return 1;
                    }
                    return 0;
                };

                var occurences = this.useUser.cart.filter(exist);

                if (occurences.length > 0) {
                    occurences[0].qty++;
                } else {
                    this.useUser.cart.push(
                        {
                            product: this.product,
                            qty: 1,
                        }
                    )
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