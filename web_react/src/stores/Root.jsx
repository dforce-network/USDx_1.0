// Stores
import TransactionsStore from "./Transactions";





class RootStore {
    constructor() {
        this.transactions = new TransactionsStore(this);
    }
}

const store = new RootStore();
export default store;




