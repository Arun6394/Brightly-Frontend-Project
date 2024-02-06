<template>
  <div class="modal-overlay overlay-content">
    <div class="modal">
      <div class="form-container">
        <form id="edit-asset-form">
          <div class="row">
            <h3>Edit Asset</h3>
            <label for="loaning-supervisor">Loaning Supervisor</label>
            <select
              class="size"
              id="loaning-supervisor"
              name="loaning-supervisor"
              v-model="selectedSupervisorname"
            >
              <option :value="selectedSupervisorName" selected>
                {{ selectedSupervisorName }}
              </option>
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
            <label for="student">Student</label>
            <select
              class="size"
              id="student"
              name="student"
              v-model="selectedStudentname"
            >
              <option :value="selectedStudentName" selected>
                {{ selectedStudentName }}
              </option>
              <option
                v-for="student in students"
                :value="student.firstName + ' ' + student.lastName"
                :key="student.id"
              >
                {{ student.firstName }} {{ student.lastName }}
              </option>
            </select>
          </div>

          <div class="row">
            <label for="asset">Asset</label>
            <select
              class="size"
              id="asset"
              name="asset"
              v-model="selectedAssetname"
            >
              <option :value="selectedAssetName" selected>
                {{ selectedAssetName }}
              </option>
              <option
                v-for="asset in assets"
                :value="asset.name"
                :key="asset.id"
              >
                {{ asset.name }}
              </option>
            </select>
          </div>

          <div class="row">
            <label for="issue-date">Issue Date</label>
            <input
              type="date"
              id="issue-date"
              name="issue-date"
              v-model="selectedIssueDate"
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
      selectedSupervisorName: this.selectedTransaction.loaningSupervisorName,
      selectedStudentName: this.selectedTransaction.studentName,
      selectedAssetName: this.selectedTransaction.assetName,
      selectedIssueDate: this.selectedTransaction.issueDate,
      transactions: [],
      assets: [],
      students: [],
      supervisors: [],
      selectedSupervisorname:
        this.selectedTransaction.loaningSupervisorName || '',
      selectedStudentname: this.selectedTransaction.studentName || '',
      selectedAssetname: this.selectedTransaction.assetName || '',
      issueDate: '',
    };
  },

  methods: {
    closeForm() {
      this.$emit('closeForm');
    },
    formatDate(dateString) {
      // Convert the input date string to a Date object
      const date = new Date(dateString);

      // Extract day, month, and year components
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();

      // Return the formatted date string
      return `${year}-${month}-${day}`;
    },
    saveForm() {
      // console.log('selectedtransactiondata', this.selectedTransaction);
      const transactionId = this.selectedTransaction.transactionId;
      // Find the selected asset in the assets array
      const selectedAsset = this.assets.find(
        (asset) => asset.name === this.selectedAssetname
      );

      const selectedStudent = this.students.find(
        (student) =>
          student.firstName + ' ' + student.lastName ===
          this.selectedStudentname
      );

      // Find the selected supervisor in the supervisors array
      const selectedSupervisor = this.supervisors.find(
        (supervisor) =>
          supervisor.firstName + ' ' + supervisor.lastName ===
          this.selectedSupervisorname
      );

      const updatedData = {
        loaningSupervisorname: this.selectedSupervisorname,
        studentname: this.selectedStudentname,
        assetName: this.selectedAssetname,
        loaningSupervisorId: selectedSupervisor
          ? selectedSupervisor.supervisorId
          : null,
        studentId: selectedStudent ? selectedStudent.studentId : null,
        assetId: selectedAsset ? selectedAsset.id : null,
        model: selectedAsset ? selectedAsset.model : null,
        loanDate: this.selectedIssueDate,
      };
      console.log('updatedData', updatedData);
      console.log('id', this.selectedTransaction.transactionId);
      fetch(`http://localhost:3000/transactions/${transactionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      })
        .then((response) => {
          if (!response.ok) {
            console.error('Error updating data:', response.statusText);
            throw new Error(response.statusText);
          }
          // Assuming the server sends a valid JSON response
          return response.json();
        })
        .then((responseData) => {
          console.log('Response from server:', responseData);
          this.$emit('saveForm', updatedData);
          this.closeForm();
          this.loadResultMethod();
        })
        .catch((error) => {
          console.error('Error updating data:', error);
        });
    },

    loadResults() {
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
              issueDate: data[id].loanDate,
              loaningSupervisorName: data[id].loaningSupervisorname,
              assetId: data[id].assetId,
              receivingSupervisorname: data[id].receivingSupervisorname,
              returnDate: data[id].returnDate,
              model:
                this.assets.find((asset) => asset.id === data[id].assetId)
                  ?.model || '',
            });
          }
          this.transactions = results;
        })
        .catch((error) => {
          console.error('Error loading data:', error);
        });
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
        });
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
            if (data[id].role === 'Student') {
              this.students.push({
                id: id,
                studentId: data[id].id,
                firstName: data[id].firstName,
                lastName: data[id].lastName,
              });
            } else if (data[id].role === 'Supervisor') {
              this.supervisors.push({
                id: id,
                supervisorId: data[id].id,
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
    this.loadResults();
    this.loadAssetData();
    this.loadUser();
    this.selectedIssueDate = this.formatDate(
      this.selectedTransaction.issueDate
    );
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
  width: 100%;
  padding: 6px 12px;
  margin: 8px 0;
  box-sizing: border-box;
  border-radius: 6px;
  border: 1px solid #292828;
}

input[type='date'] {
  width: 100%;
  padding: 15px 12px;
  margin: 8px 0;
  box-sizing: border-box;
  border-radius: 6px;
  border: 1px solid #292828;
  font-display: none;
}

body {
  font-family: Arial, sans-serif;
}

.form-container {
  width: 300px;
}

.row {
  display: flex;
  flex-direction: column;
  width: 300px;
  grid-template-rows: 100px;
  font-size: 14px;
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
  text-align: center;
  font-size: 15px;
  width: 150px;
  margin-top: 13px;
}

#save {
  background-color: #4a7274;
  border: 1px solid rgb(20, 15, 15);
  border-radius: 5px;
  margin-left: 35px;
  padding: 7px;
  margin-top: 13px;
  text-align: center;
  font-size: 15px;
  color: white;
  width: 150px;
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
}

.size {
  font-size: 12px;
}
</style>
