<template>
    <div class="col-md-6 col-lg-4 col-xl-3">
        <div id="product-1" class="single-product">
            <div class="part-1">
                <img style="height: 260px; width: 260px; object-fit: cover;" :src="product.images[0]" alt="">
                <ul>
                    <li><a href="#" v-on:click.prevent="removeProduct"><i class="fas fa-trash"></i></a></li>
                </ul>
            </div>
            <div class="part-2">
                <h3 class="product-title">Name: {{ product.name }} | Price: ${{ product.price }}</h3>
                <h4></h4>
            </div>
        </div>
    </div>

</template>

<script>
import { useUserStore } from '../../stores/UserStore';
export default {
    name: "CartItem",
    data() {
        return {
            useUser: useUserStore(),
        }
    },
    props: {
        product: Object
    },
    methods: {
        removeProduct() {
            this.useUser.cart = this.useUser.cart.filter(item => item !== this.product)
        }
    }
};
</script>

<style>
.single-product {
    transition: all .2s ease-in-out;
    margin-bottom: 26px;
}

.single-product .part-1 {
    position: relative;
    height: 260px;
    max-height: 260px;
    overflow: hidden;
}

.single-product .part-1::before {
    position: absolute;
    content: "";
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    transition: all 0.3s;
}

.single-product:hover {
    transform: scale(1.05, 1.05);
}

.single-product:hover .part-1::before {
    transform: scale(0.8, 0.8) rotate(6deg);
}

#product-1 .part-1::before {
    transition: all 0.3s;
}

.filter {
    position: absolute;
    top: 1px;
    left: 1px;
    width: 99%;
    height: 99%;
    mix-blend-mode: hue;
    /* background-color: rgba(0, 255, 0); */
    overflow: hidden;
}

.single-product .part-1 ul {
    position: absolute;
    bottom: -41px;
    left: 40px;
    margin: 0;
    padding: 0;
    list-style: none;
    opacity: 0;
    transition: bottom 0.5s, opacity 0.5s;
}

.single-product:hover .part-1 ul {
    bottom: 30px;
    opacity: 1;
}

.single-product .part-1 ul li {
    display: inline-block;
    margin-right: 4px;
}

.single-product .part-1 ul li a {
    display: inline-block;
    width: 40px;
    height: 40px;
    line-height: 40px;
    background-color: #ffffff;
    color: #444444;
    text-align: center;
    box-shadow: 0 2px 20px rgb(50 50 50 / 10%);
    transition: color 0.2s;
}

.single-product .part-1 ul li a:hover {
    color: #fe302f;
}

.single-product .part-2 .product-title {
    font-size: 1rem;
}

.single-product .part-2 h4 {
    display: inline-block;
    font-size: 1rem;
    margin-left: 2rem;
}
</style>