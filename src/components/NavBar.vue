<template>
  <section>
    <div class="title">
      <img src="../assets/logo.png" alt="" />
      <div>
        <select
          name=""
          id="lst"
          v-model="selectedUser"
          @change="emitselectedUser"
        >
          <option value="" selected>Select User</option>
          <option v-for="user in results" :key="user.id" :value="user.userId">
            {{ user.firstName }} {{ user.lastName }} ({{ user.role }})
          </option>
        </select>
      </div>
      <div>
        <button
          v-if="showCreateTransactionButton"
          id="btn"
          @click="openLoanAssetForm"
        >
          Create Transaction
        </button>
      </div>
      <div v-if="showLoanAssetForm" class="modal-overlay">
        <loan-asset @closeForm="closeLoanAssetForm"></loan-asset>
      </div>
    </div>
  </section>
</template>

<script>
import LoanAsset from './LoanAsset.vue';

export default {
  components: {
    LoanAsset,
  },
  data() {
    return {
      showLoanAssetForm: false,
      results: [],
      selectedUser: '',
      assets: [],
    };
  },
  computed: {
    showCreateTransactionButton() {
      const selectedUser = this.results.find(
        (user) => user.userId === this.selectedUser
      );
      return selectedUser && selectedUser.role === 'Supervisor';
    },
  },

  methods: {
    openLoanAssetForm() {
      this.showLoanAssetForm = true;
    },
    closeLoanAssetForm() {
      this.showLoanAssetForm = false;
    },
    emitselectedUser() {
      this.$emit('select-userid', this.selectedUser);
      // console.log('id', this.selectedUser);
    },

    loadResult() {
      fetch('http://localhost:3000/users')
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
              userId: data[id].id,
              firstName: data[id].firstName,
              lastName: data[id].lastName,
              gender: data[id].gender,
              role: data[id].role,
            });
          }
          this.results = results;
          this.$emit('results', this.results);
          this.selectedUser = this.results[450].userId;
          this.emitselectedUser();
        });
    },
  },

  mounted() {
    this.loadResult();
  },
};
</script>

<style scoped>
img {
  height: 38px;
  margin: 18px;
}

.title {
  position: relative;
  display: flex;
  flex-direction: row;
  background-color: #d6e4e5;
  margin-top: -8px;
  margin-left: -7px;
  margin-right: -8px;
  box-shadow: 2px 5px 7px rgba(0, 0, 0, 0.3);
  z-index: 1;
}

#lst {
  position: absolute;
  font-family: Arial;
  margin-left: 890px;
  margin-top: 16px;
  padding: 8px;
  margin-right: 2px;
  /* box-shadow: 0px 2px rgba(0, 0, 0, 0.2); */
  box-shadow: 0 4px 7px rgba(0, 0, 0, 0.4);
  border: 1px solid #ccc;
  border-radius: 5px;
  max-width: 180px;
  font-size: 8.5px;
  width: 130px;
  height: 33px;
}
#btn {
  /* border: 0.5px solid rgb(56, 54, 54); */
  border: 1.3px solid #475fda;
  /* box-shadow: 0px 2px rgba(0, 0, 0, 0.2); */
  box-shadow: 0 4px 7px rgba(0, 0, 0, 0.4);
  padding: 8px;
  margin-left: 730px;
  margin-top: 15px;
  text-align: center;
  font-size: 10px;
  background-color: #4a7274;
  color: white;
  border-radius: 7px;
  width: 140px;
  justify-content: center;
  text-align: center;
  height: 33px;
}
</style>
