<template>
  <form id="loan-asset-form" @submit.prevent="submitForm">
    <div class="modal-overlay overlay-content">
      <div class="modal">
        <div class="form-container">
          <div class="row">
            <h3>Loan Asset</h3>
            <label for="supervisor">Loaning Supervisor</label>
            <select
              class="size"
              id="supervisor"
              name="supervisor"
              v-model="selectedSupervisorId"
            >
              <option value="" selected>Select</option>
              <option
                v-for="supervisor in supervisors"
                :value="supervisor.id"
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
              v-model="selectedStudentId"
            >
              <option value="" selected>Select</option>
              <option
                v-for="student in students"
                :value="student.id"
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
              v-model="selectedAssetId"
            >
              <option value="" selected>Select</option>
              <option v-for="asset in assets" :value="asset.id" :key="asset.id">
                {{ asset.assetName }}
              </option>
            </select>
          </div>

          <div class="row">
            <label for="issue-date">Issue Date</label>
            <input
              type="date"
              id="issue-date"
              name="issue-date"
              placeholder="DD/MM/YYYY"
              v-model="issueDate"
            />
          </div>

          <div class="button-container">
            <button type="button" id="cancel" @click="closeForm">Cancel</button>
            <button type="submit" id="save">Save</button>
          </div>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
import store from '../store.js';
import { v4 as uuidv4 } from 'uuid';
export default {
  data() {
    return {
      students: [],
      assets: [],
      supervisors: [],
      loaningSupervisorName: '',
      selectedAssetId: '',
      selectedStudentId: '',
      selectedSupervisorId: '',
      studentName: '',
      assetName: '',
      assetId: '',
      model: '',
      issueDate: '',
      id: null,
    };
  },

  computed: {
    loadResultMethod() {
      return store.state.loadResultMethod;
    },
  },

  emits: ['newTransaction', 'closeForm'],

  methods: {
    generateUniqueId() {
      this.id = uuidv4();
    },

    submitForm() {
      this.generateUniqueId();

      const selectedAsset = this.assets.find((asset) => {
        return asset.id === this.selectedAssetId;
      });
      const selectedStudent = this.students.find((student) => {
        return student.id === this.selectedStudentId;
      });
      const selectedSupervisor = this.supervisors.find((supervisor) => {
        return supervisor.id === this.selectedSupervisorId;
      });

      if (selectedAsset || selectedStudent || selectedSupervisor) {
        var { assetId } = selectedAsset;
        var { studentId } = selectedStudent;
        var { supervisorId } = selectedSupervisor;

        const newTransaction = {
          id: this.id,
          transactionType: 'Loan',
          loaningSupervisorId: supervisorId,
          loaningSupervisorname:
            selectedSupervisor.firstName + ' ' + selectedSupervisor.lastName,
          studentId: studentId,
          studentname:
            selectedStudent.firstName + ' ' + selectedStudent.lastName,
          assetId: assetId,
          assetName: selectedAsset.assetName,
          loanDate: this.issueDate,
          receivingSupervisorId: null,
          receivingSupervisorname: null,
          returnDate: null,
          model: selectedAsset.model,
        };

        fetch('http://localhost:3000/transactions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newTransaction),
        })
          .then((response) => response.json())
          .then((data) => {
            this.$emit('newTransaction', data);

            this.closeForm();
            this.loadResultMethod();
          })
          .catch((error) => {
            console.error('Error creating a new transaction:', error);
          });
      }
    },

    closeForm() {
      this.$emit('closeForm', { students: this.students, assets: this.assets });
    },

    loadAsset() {
      fetch('http://localhost:3000/assets')
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
              assetId: data[id].id,
              assetName: data[id].name,
              serialNumber: data[id].serialNumber,
              model: data[id].model,
            });
          }
          this.assets = results;
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
    this.loadAsset();
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

body {
  font-family: Arial, sans-serif;
}

.form-container {
  width: 300px;
  margin: 0 auto;
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
  border: 1px solid #ccc;
  height: 30px;
}

input[type='date'] {
  height: 30px;
  border-radius: 7px;
  border: 0.1px solid;
  margin-top: 5px;
  border: 1px solid #ccc;
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
  font-size: 11px;
}
</style>
