import { defineCustomElement } from 'vue';
import TableCe from './components/Table.ce.vue';

// 1. 將 Vue 組件轉換為 Web Component
const RemoteVueTable = defineCustomElement(TableCe);

// 2. 註冊 Custom Element
// 標籤名稱必須包含連字符 (-)
customElements.define('remote-vue-table', RemoteVueTable);

// 註: 作為 Library，我們不需要 createApp 掛載 Vue 應用，只需註冊元件即可
