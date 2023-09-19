<template>
    <section class="py-5 text-center container">
        <div class="row justify-content-center">
            <div class="col-lg-6">
                <div class="input-group mb-3">
                    <input type="text" class="form-control" placeholder="Search..." v-model="searchTerm" />
                    <div class="input-group-append mx-3">
                        <button class="btn btn-primary " @click="filterItems">
                            <i class="fas fa-search"></i>
                            Search
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="row d-flex justify-content-center">
            <ProductItem v-for="product in products" :product="product" :key="product.id" />
        </div>

    </section>
</template>

<script>
import axios from 'axios';
import ProductItem from './ProductItem.vue'

export default {
    name: "ProductsPage",
    components: {
        ProductItem
    },
    data() {
        return {
            products: null
        }
    },
    mounted() {
        axios.get('http://localhost:8000/api/products').then(response => {
            this.products = response.data;
            console.log(this.products)
        }).catch(error => {
            console.log(error);
        });
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