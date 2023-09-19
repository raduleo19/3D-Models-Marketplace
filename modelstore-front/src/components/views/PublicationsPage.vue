<template>
    <section class="py-5 text-center container">
        <div class="d-flex flex-column justify-content-center align-items-center">
            <div class="mb-3">
                <label for="sortOrder" class="form-label">Sort by:</label>
                <select class="form-select" id="sortOrder" v-model="selectedSortOrder" @change="sortChange">
                    <option value="price">Price</option>
                    <option value="downloads">Downloads</option>
                    <option value="rating">Rating</option>
                    <option value="earnings">Earnings</option>
                </select>
            </div>
            <PublicationItem v-for="product in products" :product="product" :key="product.id" />
        </div>
    </section>
</template>

<script>
import axios from 'axios';
import PublicationItem from './PublicationItem.vue'
import { useUserStore } from '../../stores/UserStore';

export default {
    name: "PublicationsPage",
    components: {
        PublicationItem,
    },
    data() {
        return {
            useUser: useUserStore(),
            products: null,
            selectedSortOrder: 'price',
        }
    },
    mounted() {
        axios.get('http://localhost:8000/api/publications', { headers: { "Authorization": `Bearer ${this.useUser.token}` } }).then(response => {
            this.products = response.data;
            this.products.sort(function (a, b) { return a.price - b.price });
            console.log(response.data)
        }).catch(error => {
            console.log(error);
        });
    },
    methods: {
        sortChange: function() {
            if (this.selectedSortOrder == 'price') {
                this.products.sort(function (a, b) { return a.price - b.price });
            } else if (this.selectedSortOrder == 'downloads') {
                this.products.sort(function (a, b) { return a.downloads - b.downloads });
            } else if (this.selectedSortOrder == 'rating') {
                this.products.sort(function (a, b) { return a.rating - b.rating });
            } else if (this.selectedSortOrder == 'earnings') {
                this.products.sort(function (a, b) { return a.earnings - b.earnings });
            }
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