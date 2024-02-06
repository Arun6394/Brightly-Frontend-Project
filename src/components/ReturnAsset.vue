<template>
  <div class="modal-overlay overlay-content">
    <div class="modal">
      <div class="form-container">
        <form id="loan-asset-form">
          <div class="row">
            <h3>Return Asset</h3>
            <label class="heading" for="loaning-supervisor"
              >Loaning Supervisor</label
            >
            <input
              type="text"
              id="loaning-supervisor"
              name="loaning-supervisor"
              v-model="formData.loaningSupervisorName"
              disabled
            />
          </div>
          <div class="row">
            <label class="heading" for="student">Student</label>
            <input
              type="text"
              id="student"
              v-model="formData.studentName"
              disabled
            />
          </div>

          <div class="row">
            <label class="heading" for="asset">Asset</label>
            <input
              type="text"
              id="asset"
              name="asset"
              v-model="formData.assetName"
              disabled
            />
          </div>

          <div class="row">
            <label class="heading" for="issue-date">Issue Date</label>
            <input
              type="text"
              id="issue-date"
              name="issue-date"
              placeholder="DD/MM/YYYY"
              v-model="formData.issueDate"
              disabled
            />
          </div>

          <div class="row">
            <label class="heading" for="receiving-supervisor"
              >Receiving Supervisor</label
            >
            <select
              id="receiving-supervisor"
              name="receiving-supervisor"
              v-model="formData.selectedReceivingSupervisorName"
            >
              <option value="" selected>select</option>
              <option
                v-for="supervisor in supervisors"
                :value="supervisor.firstName + ' ' + supervisor.lastName"
                :key="supervisor.id"
              >
                {{ supervisor.firstName }} {{ supervisor.lastName }}
              </option>
            </select>
          </div>

          <div class="row">
            <label class="heading" for="return-date">Return Date</label>
            <input
              type="date"
              id="return-date"
              name="return-date"
              placeholder="DD/MM/YYYY"
              v-model="formData.selectedReturnDate"
            />
          </div>

          <div class="button-container">
            <button type="button" id="cancel" @click="closeForm">Cancel</button>
            <button type="button" id="save" @click="saveForm">Save</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import store from '../store.js';
export default {
  props: {
    selectedTransaction: {
      type: Object,
      default: null,
    },
  },
  computed: {
    loadResultMethod() {
      return store.state.loadResultMethod;
    },
  },
  data() {
    return {
      formData: {
        loaningSupervisorName: '',
        studentName: '',
        assetName: '',
        issueDate: '',
        selectedReceivingSupervisorName: '',
        selectedReturnDate: '',
      },
      supervisors: [],
    };
  },

  watch: {
    selectedTransaction: {
      handler(newTransaction) {
        this.formData = { ...newTransaction };
      },
      immediate: true,
    },
  },

  methods: {
    saveForm() {
      // console.log('selectedtransactiondata', this.selectedTransaction);
      const transactionId = this.selectedTransaction.transactionId;
      const updatedData = {
        receivingSupervisorId: this.selectedTransaction.id,
        returnDate: this.formData.selectedReturnDate,
        transactionType: 'Return', // Set the transaction type to Return
        receivingSupervisorname: this.formData.selectedReceivingSupervisorName,
      };
      // console.log('updatedData', updatedData);
      fetch(`http://localhost:3000/transactions/${transactionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      })
        .then((response) => {
          if (response.ok) {
            this.$emit('saveForm', updatedData);
            this.closeForm();
            this.loadResultMethod();
            // Close the form or handle success as needed
          } else {
            // Handle error
            console.error('Error updating data:', response.statusText);
          }
        })
        .catch((error) => {
          console.error('Error updating data:', error);
        });
    },

    closeForm() {
      this.$emit('closeForm');
      // console.log('data',this.formData.selectedReceivingSupervisorName)
    },

    loadUser() {
      fetch('http://localhost:3000/users')
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
        })
        .then((data) => {
          const results = [];
          for (const id in data) {
            if (data[id].role === 'Supervisor') {
              this.supervisors.push({
                id: id,
                firstName: data[id].firstName,
                lastName: data[id].lastName,
              });
            }
          }
          this.users = results;
        });
    },
  },
  mounted() {
    this.loadUser();
  },
  //inject: ['rerender'],
};
</script>

<style scoped>
.button-container {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
}
input[type='text'] {
  padding: 6px 12px;
  margin: 8px 0;
  box-sizing: border-box;
  border-radius: 6px;
  border: 1px solid #ccc;
  height: 30px;
  background-color: white;
}

.heading {
  font-size: 12px;
  padding-left: 8px;
}

input[type='date'] {
  padding: 15px 12px;
  margin: 8px 0;
  box-sizing: border-box;
  border-radius: 6px;
  border: 1px solid #ccc;
  height: 30px;
}
#receiving-supervisor {
  border: 1px solid #ccc;
}

body {
  font-family: Arial, sans-serif;
}
.row {
  display: flex;
  flex-direction: column;
  width: 287px;
  grid-template-rows: 100px;
}

.row h3 {
  margin-top: -1px;
}

.button-container {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}

label {
  display: block;
  margin-top: -2px;
}

select,
input[type='text'] {
  width: 100%;
  padding: 6px 12px;
  margin: 8px 0;
  box-sizing: border-box;
  border-radius: 6px;
}

input[type='date'] {
  height: 25px;
}

button:hover {
  opacity: 0.8;
}

#cancel {
  background-color: white;
  color: black;
  border: 1px solid rgb(20, 15, 15);
  border-radius: 5px;
  padding: 5px;
  text-align: center;
  font-size: 15px;
  width: 250px;
  margin-top: 13px;
}

#save {
  background-color: #4a7274;
  border: 1px solid rgb(20, 15, 15);
  border-radius: 5px;
  margin-left: 12px;
  padding: 7px;
  margin-top: 13px;
  text-align: center;
  font-size: 15px;
  color: white;
  width: 250px;
}

.modal-overlay::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(111, 119, 132, 0.7);
  backdrop-filter: blur(4px);
  z-index: 1002;
}

.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
  z-index: 1003;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1002;
  display: flex;
  justify-content: center;
  align-items: center;
}

.form-container {
  position: relative;
  z-index: 1004;
  width: 290px;
  margin: 0 auto;
}
</style>
