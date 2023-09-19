<template>
    <div class="container py-5">
        <div class="row">
            <div class="col-lg-8 mx-auto">
                <div class="card">
                    <div class="card-header text-center">
                        <h5>Current Balance</h5>
                        <p class="display-4">{{ this.useUser.userData.balance }}$</p>
                        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addMoneyModal">Add
                            Money</button>
                    </div>

                    <!-- Add Money Modal -->
                    <div class="modal fade" id="addMoneyModal" tabindex="-1" aria-labelledby="addMoneyModalLabel"
                        aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="addMoneyModalLabel">Add Money</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal"
                                        aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    <form v-on:submit.prevent="addMoney">
                                        <div class="mb-3">
                                            <label for="amount" class="form-label">Amount</label>
                                            <input type="number" class="form-control" id="amount" v-model="amountToAdd">
                                        </div>
                                        <button type="submit" class="btn btn-primary">Submit</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="card-body">
                        <h5 class="mb-3">Cash-in History</h5>

                        <div class="accordion" id="cashInHistory">
                            <div v-for="(transaction, index) in transactions" :key="index" class="accordion-item">
                                <h2 class="accordion-header" :id="'heading' + index">
                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                        :data-bs-target="'#collapse' + index" aria-expanded="false"
                                        :aria-controls="'collapse' + index">
                                        Transaction #{{ index + 1 }}
                                    </button>
                                </h2>
                                <div :id="'collapse' + index" class="accordion-collapse collapse"
                                    :aria-labelledby="'heading' + index" data-bs-parent="#cashInHistory">
                                    <div class="accordion-body">
                                        <strong>Date:</strong> {{ transaction.date }}<br>
                                        <strong>Amount:</strong> ${{ transaction.amount }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { useUserStore } from '../../stores/UserStore';

export default {
    data() {
        return {
            useUser: useUserStore(),
            balance: 0,
            transactions: [],
            amountToAdd: null,
        }
    },
    mounted() {
        axios.get('http://localhost:8000/api/transactions', { headers: { "Authorization": `Bearer ${this.useUser.token}` } }).then(response => {
            this.transactions = response.data;
            this.balance = this.useUser.userData.balance;
            console.log(this.transactions);
        }).catch(error => {
            console.log(error);
        });
    },
    methods: {
        addMoney() {
            axios.post('http://localhost:8000/api/transactions', {amount: this.amountToAdd},{ headers: { "Authorization": `Bearer ${this.useUser.token}` } }).then(response => {
            this.balance += this.amountToAdd;
            this.useUser.userData.balance += this.amountToAdd;

            this.transactions.unshift(response.data);
            this.amountToAdd = null;
        }).catch(error => {
            console.log(error);
        });
        }
    }
}
</script>
