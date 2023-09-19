<template>
    <div class="col-md-8 col-lg-7 col-xl-6 col-xxl-4 bg-light p-5 rounded mx-auto mt-md-5">
        <form class="form-signin" @submit.prevent="handleSubmit" ref="form">
            <div style="display: flex; justify-content: center;">
                <h1 class="h3 mb-4">Publish 3D Model</h1>
            </div>

            <div class="form-group mb-4">
                <label class="form-label" for="inputName">Name</label>
                <input type="text" id="inputName" class="form-control mt-1" v-model="name" placeholder="Name" required
                    autofocus>
            </div>

            <div class="form-group mb-4">
                <label class="form-label" for="inputDescription">Description</label>
                <textarea class="form-control" id="inputDescription" rows="3" v-model="description"></textarea>
            </div>

            <div class="form-group mb-4">
                <label class="form-label" for="inputPrice">Price</label>
                <input type="number" id="inputPrice" class="form-control mt-1" v-model="price" placeholder="Price" min="0"
                    step="any" required autofocus>
            </div>

            <div class="form-group mb-4">
                <label for="inputImage" class="form-label">Images</label>
                <input class="form-control" accept="image/*" type="file" id="inputImage" ref="inputImage" multiple
                    @change="onImageSelected" required>
                <small id="inputImageHelp" class="form-text text-muted">You can drag'n'drop.</small>
            </div>


            <div class="form-group mb-4">
                <label for="inputModel" class="form-label">Model</label>
                <input class="form-control" type="file" id="inputModel" ref="inputModel" @change="onModelSelected" required>
                <small id="inputImageHelp" class="form-text text-muted">You can drag'n'drop.</small>
            </div>

            <template v-if="uploading">
                <label>Progress: </label>
                <div class="progress">
                    <div class="progress-bar" role="progressbar" aria-label="Basic example"
                        :style="{ width: this.uploadPercentage + '%' }" :aria-valuenow="this.uploadPercentage"
                        aria-valuemin="0" aria-valuemax="1"></div>
                </div>
            </template>


            <div style="display: flex; justify-content: center;">
                <button class="btn btn-lg col-5 btn-primary btn-block mt-3" type="submit">Submit</button>
            </div>
        </form>
    </div>
</template>

<script>
import { useUserStore } from '../../stores/UserStore';
import axios from 'axios';

export default {
    name: "PublishPage",
    data() {
        return {
            useUser: useUserStore(),
            name: "",
            description: "",
            price: 0,
            images: "",
            model: "",
            uploadPercentage: 0,
            uploading: 0
        }
    },
    methods: {
        onMounted() {
        },
        onImageSelected(event) {
            this.images = event.target.files;
        },
        onModelSelected(event) {
            this.model = event.target.files[0];
        },
        handleSubmit() {
            this.uploading = 1;
            var data = new FormData();

            data.append('name', this.name);
            data.append('description', this.description);
            data.append('price', this.price);
            for (var i = 0; i < this.images.length; i++) {
                data.append('images', this.images[i], this.images[i].name);
            }

            data.append('model', this.model, this.model.name);
            data.append('modelType', this.model.name.split('.').pop());

            axios.post('http://localhost:8000/api/products', data, {
                headers: { "Authorization": `Bearer ${this.useUser.token}` }, onUploadProgress: function (progressEvent) {
                    this.uploadPercentage = parseInt(Math.round((progressEvent.loaded / progressEvent.total) * 100));
                    console.log(this.uploadPercentage)


                }.bind(this)
            })
                .then((response) => {
                    this.name = "";
                    this.description = "";
                    this.price = 0;
                    this.$refs.form.reset();
                    this.uploadPercentage = 0;
                    this.uploading = 0;
                    alert("Product published successfully");
                })
                .catch(error => {
                    console.log(error);
                });
        },
    },
};
</script>