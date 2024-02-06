import { createApp } from 'vue';
import App from './App.vue';
import ViewTransactions from './components/ViewTransactions.vue';
import LoanAsset from './components/LoanAsset.vue';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { faFileArrowDown } from '@fortawesome/free-solid-svg-icons';

library.add(faPen, faFileArrowDown);

const app = createApp(App);
app.component('view-transactions', ViewTransactions);
app.component('loan-asset', LoanAsset);
app.component('font-awesome-icon', FontAwesomeIcon);

app.mount('#app');
