<!-- app.vue template -->
<template>
  <div>
    <navbar @select-userid="filterTransactions" @results="getResults" />
    <ReturnAsset
      v-if="isReturnAssetFormOpen"
      @closeForm="closeReturnAssetForm"
      :selectedTransaction="selectedTransaction"
      @saveForm="handleSaveForm"
    />
    <loanasset
      @openEditAssetFormm="openEditAssetFormm"
      v-if="showLoanAssetForm"
      @closeForm="closeLoanAssetForm"
      @newTransaction="handleNewTransaction"
    />
    <viewtransaction
      @openReturnAssetForm="openReturnAssetForm"
      @openEditAssetForm="openEditAssetForm"
      @emittransactions="getTransactions"
      :newfilteredTransactions="newfilteredTransactions"
      :selectedId="selectedId"
      :users="users"
    />
    <EditAsset
      :selectedTransaction="selectedTransaction"
      v-if="isEditAssetFormOpen"
      @closeForm="closeEditAssetForm"
      @saveForm="handleEditForm"
    />
  </div>
</template>

<script>
import navbar from './components/NavBar.vue';
import loanasset from './components/LoanAsset.vue';
import viewtransaction from './components/ViewTransactions.vue';
import ReturnAsset from './components/ReturnAsset.vue';
import EditAsset from './components/EditAsset.vue';

export default {
  components: {
    navbar,
    loanasset,
    viewtransaction,
    ReturnAsset,
    EditAsset,
  },
  data() {
    return {
      transactions: [],
      showLoanAssetForm: false,
      isReturnAssetFormOpen: false,
      selectedTransaction: null,
      isEditAssetFormOpen: false,
      users: [],
      transactionDetails: [],
      newfilteredTransactions: [],
      selectedId: '',
    };
  },
  methods: {
    getResults(results) {
      this.users = results;
    },
    getTransactions(transactions) {
      this.transactionDetails = transactions;
      if (this.selectedId) {
        this.filterTransactions(this.selectedId);
      }
    },

    filterTransactions(userId) {
      // Filter transactions based on the selected user ID
      this.selectedId = userId;
      //console.log('SELECTED ID', this.selectedId);
      // console.log('users data', this.users);
      //console.log('transactions data', this.transactionDetails);
      const selectedUser = this.users.find((user) => user.userId === userId);
      //console.log('userrole', selectedUser);
      if (selectedUser.role === 'Student') {
        this.newfilteredTransactions = this.transactionDetails.filter(
          (transaction) => {
            return transaction.studentId === userId;
          }
        );
        //console.log('trsid', this.newfilteredTransactions);
      } else if (selectedUser.role === 'Supervisor') {
        this.newfilteredTransactions = this.transactionDetails;
      }
      // console.log(
      //   'newfilteredTransactions array',
      //   this.newfilteredTransactions
      // );
    },
    handleNewTransaction(newTransaction) {
      newTransaction.expanded = false;
      this.transactions.push(newTransaction);
    },
    handleSaveForm() {
      this.isReturnAssetFormOpen = false;
    },
    handleEditForm() {
      this.isEditAssetFormOpen = false;
    },

    openReturnAssetForm(transaction) {
      this.selectedTransaction = transaction;
      this.isReturnAssetFormOpen = true;
    },
    closeReturnAssetForm() {
      this.isReturnAssetFormOpen = false;
    },
    openEditAssetForm(transaction) {
      // Set the selected transaction and open the EditAsset form
      this.selectedTransaction = transaction;
      this.isEditAssetFormOpen = true;
    },
    closeEditAssetForm() {
      this.isEditAssetFormOpen = false;
      this.selectedTransaction = null;
    },

    closeLoanAssetForm() {
      this.showLoanAssetForm = false;
    },
  },
};
</script>

<style></style>
