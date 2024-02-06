<template>
  <div class="body">
    <div class="container" v-if="dataLoaded">
      <div class="btn" v-if="filteredTransactions.length > 0">
        <div class="btnn">
          <div class="detail"><label for="assetList">Asset</label></div>
          <div>
            <select
              class="list"
              id="assetList"
              v-model="selectedAsset"
              @change="filterTransactions"
            >
              <option value="" selected>Filter by Asset</option>
              <option
                v-for="asset in assets"
                :key="asset.id"
                :value="asset.name"
              >
                {{ asset.name }}
              </option>
            </select>
          </div>
        </div>
        <div class="btnn">
          <div class="detail"><label for="userList">User</label></div>
          <div>
            <select
              class="list"
              id="userList"
              v-model="selectedUser"
              @change="filterTransactions"
            >
              <option value="" selected>Filter by User</option>
              <option
                v-for="trans in transactions"
                :key="trans.id"
                :value="trans.studentName"
              >
                {{ trans.studentName }}
              </option>
            </select>
          </div>
        </div>
        <div class="btnn">
          <div class="detail"><label for="dateList">Date</label></div>
          <div>
            <input
              type="date"
              v-model="selectedDate"
              @change="filterTransactions"
            />
          </div>
        </div>
      </div>
      <div class="card-container" v-if="filteredTransactions.length > 0">
        <div
          v-for="trans in filteredTransactions"
          :key="trans.transactionId"
          class="card"
          @click="toggleCard(trans)"
          :class="{
            expanded: trans.expanded,
            'expanded-loan': trans.transactionType === 'Loan',
            'expanded-return': trans.transactionType === 'Return',
          }"
        >
          <img
            v-if="trans.expanded"
            src="../assets/MicrosoftTeams-image.png"
            alt="Common Image"
            class="card-image"
          />
          <div class="card-content">
            <div
              class="edit"
              v-if="
                trans.expanded &&
                trans.transactionType === 'Loan' &&
                selectedUserIsSupervisor
              "
              @click="openEditAssetForm(trans)"
            >
              <div class="pen-container">
                <font-awesome-icon :icon="['fas', 'pen']" />
              </div>
            </div>
            <div class="transaction-wrapper">
              <div
                class="transaction-type-circle"
                :class="trans.transactionType.toLowerCase()"
              ></div>
            </div>
            <div class="property">
              <p>{{ trans.transactionId }}</p>
            </div>
            <div class="property">
              <h3>{{ trans.assetName }}</h3>
            </div>
            <div class="property">
              <h5>{{ trans.studentName }}</h5>
            </div>
            <div class="date-type">
              <div class="propertyy" v-if="trans.transactionType === 'Return'">
                <b>Return Date:</b>
                {{ formatDate(trans.returnDate) }}
              </div>
              <div class="propertyy">
                <b>Issue Date:</b>
                {{ formatDate(trans.issueDate) }}
              </div>
            </div>
            <div class="propertyy" v-if="trans.transactionType === 'Return'">
              <b>Receiving Supervisor:</b> {{ trans.receivingSupervisorname }}
            </div>
            <div class="propertyy">
              <b>Loaning Supervisor:</b> {{ trans.loaningSupervisorName }}
            </div>
            <div class="propertyy" v-if="trans.expanded">
              <b>Asset ID:</b> {{ trans.assetId }}
            </div>
            <div class="propertyy" v-if="trans.expanded">
              <b>Model:</b> {{ trans.model }}
            </div>
            <div
              class="return"
              v-if="
                trans.expanded &&
                trans.transactionType === 'Loan' &&
                selectedUserIsSupervisor
              "
              @click="openReturnAssetForm(trans)"
            >
              <div class="icon-container">
                <font-awesome-icon :icon="['fas', 'file-arrow-down']" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="noData">
        <img
          class="noDataimg"
          src="../assets/alien spaceship-rafiki 3.png"
          alt="No Data Available"
        />
        <p class="noDatatext">No Data Available!</p>
      </div>
    </div>
    <div v-else class="loading">
      <div class="spinner"></div>
      <p>Loading...</p>
    </div>
  </div>
</template>

<script>
import store from '../store.js';
export default {
  props: ['newfilteredTransactions', 'selectedId', 'users'],
  data() {
    return {
      transactions: [],
      assets: [],
      selectedAsset: '',
      selectedUser: '',
      selectedDate: '',
      dataLoaded: false,
    };
  },

  computed: {
    filteredTransactions() {
      let filtered = [...this.transactions];
      if (this.newfilteredTransactions.length !== 0) {
        filtered = [...this.newfilteredTransactions];
      }
      if (this.selectedAsset) {
        filtered = filtered.filter(
          (trans) => trans.assetName === this.selectedAsset
        );
      }

      if (this.selectedUser) {
        filtered = filtered.filter(
          (trans) => trans.studentName === this.selectedUser
        );
      }

      if (this.selectedDate) {
        const formatedDate = this.formatDate(this.selectedDate);
        filtered = filtered.filter(
          (trans) => this.formatDate(trans.issueDate) === formatedDate
        );
      }

      return filtered;
    },

    selectedUserIsSupervisor() {
      const selectedUser = this.users.find(
        (user) => user.userId === this.selectedId
      );
      return selectedUser && selectedUser.role === 'Supervisor';
    },
  },

  watch: {
    selectedId(newVal) {
      console.log(newVal);
      this.selectedAsset = '';
      this.selectedDate = '';
      this.selectedUser = '';
      this.loadResult();
    },
  },

  methods: {
    handleReturnAssetSave(updatedData) {
      // Find the corresponding transaction in the transactions array
      const updatedTransaction = this.transactions.find(
        (trans) => trans.id === this.selectedTransaction.id
      );

      // Update the transaction data with the new fields
      updatedTransaction.receivingSupervisorId = updatedData.id;
      updatedTransaction.returnDate = updatedData.returnDate;
      updatedTransaction.transactionType = 'Return'; // Set the transaction type to Return
      updatedTransaction.receivingSupervisorname =
        updatedData.receivingSupervisorname;
      //this.loadResult();
    },

    handleEditAssetSave(updatedData) {
      // Find the corresponding transaction in the transactions array
      const updatedTransaction = this.transactions.find(
        (trans) => trans.id === this.selectedTransaction.id
      );

      // Update the transaction data with the new fields
      updatedTransaction.loaningSupervisorname =
        updatedData.selectedSupervisorname;
      updatedTransaction.studentname = updatedData.selectedStudentname;
      updatedTransaction.selectedAssetname = updatedData.selectedAssetname;
      updatedTransaction.loaningSupervisorId = updatedData.supervisorId;
      updatedTransaction.studentId = updatedData.studentId;
      updatedTransaction.assetId = updatedData.assetId;
      updatedTransaction.model = updatedData.model;
      updatedTransaction.loanDate = updatedData.issueDate;
      //this.loadResult();
    },

    formatDate(dateString) {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();

      return `${day}-${month}-${year}`;
    },
    loadResult() {
      fetch('http://localhost:3000/transactions')
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
        })
        .then((data) => {
          const results = [];
          for (const id in data) {
            results.push({
              id: id,
              transactionId: data[id].id,
              assetName: data[id].assetName,
              studentName: data[id].studentname,
              loaningSupervisorId: data[id].loaningSupervisorId,
              receivingSupervisorId: data[id].receivingSupervisorId,
              studentId: data[id].studentId,
              issueDate: data[id].loanDate,
              loaningSupervisorName: data[id].loaningSupervisorname,
              assetId: data[id].assetId,
              receivingSupervisorname: data[id].receivingSupervisorname,
              returnDate: data[id].returnDate,
              model:
                this.assets.find((asset) => asset.id === data[id].assetId)
                  ?.model || '',
              transactionType: data[id].transactionType,
              expanded: false,
            });
          }
          this.transactions = results;
          this.$emit('emittransactions', this.transactions);
          this.dataLoaded = true;
        })
        .catch((error) => {
          console.error('Error loading data:', error);
          this.dataLoaded = true;
        });
      store.commit('setLoadResultMethod', this.loadResult);
    },

    openReturnAssetForm(transaction) {
      this.$emit('openReturnAssetForm', transaction);
    },
    openEditAssetForm(transaction) {
      // Emit an event to open the EditAsset form and pass the selected transaction details
      this.$emit('openEditAssetForm', transaction);
    },

    loadAssetData() {
      fetch('http://localhost:3000/assets')
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
        })
        .then((data) => {
          this.assets = data;
          this.loadResult();
        });
    },

    toggleCard(card) {
      card.expanded = !card.expanded;
    },
  },

  mounted() {
    this.loadResult();
    this.loadAssetData();
  },
};
</script>

<style scoped>
.btn {
  display: flex;
  flex-direction: row;
  margin-top: 22px;
}

.detail {
  margin-left: 47px;
  margin-bottom: 10px;
}

.list {
  margin-left: 47px;
  /* box-shadow: 1px 1px 2px 2px rgba(0, 0, 0, 0.2); */
  box-shadow: 0 3px 7px rgba(0, 0, 0, 0.3);
  border: 1px solid #ccc;
  text-align: left;
  font-size: 9px;
  border-radius: 5px;
  padding: 6px 5px 6px;
  width: 130px;
  height: 30px;
}

input,
date {
  margin-left: 47px;
  /* box-shadow: 1px 1px 2px 2px rgba(0, 0, 0, 0.2); */
  box-shadow: 0 3px 7px rgba(0, 0, 0, 0.3);
  /* border: 1px solid black; */
  border: 1px solid #ccc;
  text-align: left;
  font-size: 11px;
  border-radius: 5px;
  padding: 6px 2px 6px;
  width: 130px;
  height: 16px;
}

.property {
  padding-top: -2px;
}
.container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  background-color: #f5fbfc;
  padding-top: 1px;
  margin-left: -8px;
  margin-right: -7px;
  /* margin-top: 5px; */
  position: relative;
  align-items: center;
}
.loading {
  text-align: center;
  padding-top: 150px;
}

.spinner {
  display: inline-block;
  width: 50px;
  height: 50px;
  border: 3px solid rgba(0, 0, 0, 0.3);
  border-radius: 50%;
  border-top: 3px solid #4fa2da;
  animation: spin 1s linear infinite;
  justify-content: center;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.card-container {
  width: 100%;
  /*display: flex;*/
  flex-wrap: wrap;
  columns: 18rem auto;
  /* gap: 20px; */
  margin-top: 30px;
  column-gap: 0px;
  padding-left: 40px;
  padding-right: 20px;
}

.card {
  width: 16.5rem;
  box-shadow: 2px 5px 7px rgba(0, 0, 0, 0.3);
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  overflow: hidden;
  border: 1px solid #ccc;
  border-radius: 8px;
  height: 12.8rem;
  display: flex;
  flex-direction: column;
  margin-bottom: 21px;
  background-color: white;
}

.card.expanded {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  /* border: 2px solid darkorange; */
  z-index: 1;
  height: 26rem;
  display: flex;
}

.card.expanded.expanded-loan {
  border: 2px solid darkorange;
}

.card.expanded.expanded-return {
  border: 2px solid green;
}

.card-image {
  width: 100%;
  height: 130px;
  object-fit: cover;
  /* border-bottom: 1px solid #ccc; */
  border-radius: 10px;
}

.card-content {
  padding-left: 10px;
  padding-top: 1px;
  position: relative;
  margin-top: 15px;
}

.edit {
  position: absolute;
  top: 0;
  right: 0;
  margin: 5px;
  color: #faf7f7; /* Set the color you prefer for the pencil icon */
  cursor: pointer;
  z-index: 1;
}

.icon-container {
  width: 35px;
  height: 35px;
  background-color: rgb(255, 140, 0);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: -5px;
  margin-right: 13px;
}

.pen-container {
  width: 35px;
  height: 35px;
  background-color: rgb(255, 140, 0);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: -127px;
  margin-right: 13px;
}

.return {
  position: absolute;

  right: 0;
  margin: 5px;
  color: #f1eeee; /* Set the color you prefer for the pencil icon */
  cursor: pointer;
}

.property {
  margin-bottom: 6px;
  padding-bottom: -2px;
}

.propertyy {
  border: 1px solid #ccc; /* Border for each property box */
  border-radius: 6px;
  box-shadow: 0 3px 7px rgba(0, 0, 0, 0.3);
  margin-bottom: 10px;
  padding: 4px 4px;
  justify-content: center;
  align-content: center;
  font-size: 10px;
  display: inline-block;
}

.property h3 {
  margin-top: -6px;
}

.property p {
  font-size: 10px;
}

.property h5 {
  margin-top: -9px;
}

.noDataimg {
  width: 492px;
  padding-left: 400px;
  padding-top: -6px;
  margin-top: -20px;
}

.noDatatext {
  color: rgb(3, 75, 3);
  font-weight: bolder;
  font-size: 22px;
  padding-left: 560px;
  margin-top: -9px;
}

.date-type {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-right: 1.5rem;
}
.transaction-wrapper {
  position: relative;
}

.transaction-type-circle {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  position: absolute;
  top: -3px;
  right: 8px;
  /* transition: top 2s, right 2s; */
}

.card.expanded .transaction-type-circle {
  top: -140px;
  right: 241px;
}

.transaction-type-circle.loan {
  background-color: rgb(218, 120, 0);
}

.transaction-type-circle.return {
  background-color: rgb(3, 100, 3);
}
.body {
  background-color: #f5fbfc;
  height: 86.52vh;
}
</style>
