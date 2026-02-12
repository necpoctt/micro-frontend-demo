import React from 'react';
import ReactDOM from 'react-dom/client';
import { ElectricityChart } from './components/ElectricityChart';
import { PieChart } from './components/PieChart'; // [新增] 引入新組件

// ---------------------------------------------------------
// 1. 定義通用的 Web Component 轉換器 (Factory Function)
// ---------------------------------------------------------
function registerReactComponent(tagName: string, ReactComponent: React.FC<any>, attributes: string[]) {
  // 如果已經註冊過，就略過 (避免 Hot Reload 報錯)
  if (customElements.get(tagName)) return;

  class WebComponentWrapper extends HTMLElement {
    private mountPoint: HTMLDivElement;
    private root: ReactDOM.Root;

    static get observedAttributes() {
      return attributes;
    }

    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.mountPoint = document.createElement('div');
      this.mountPoint.style.width = '100%';
      this.mountPoint.style.height = '100%';
      this.shadowRoot!.appendChild(this.mountPoint);
      this.root = ReactDOM.createRoot(this.mountPoint);
    }

    attributeChangedCallback() {
      this.render();
    }

    connectedCallback() {
      this.render();
    }

    // [關鍵] 通用的屬性解析邏輯
    getPropsFromAttributes() {
      const props: Record<string, any> = {};

      attributes.forEach((attr) => {
        const rawValue = this.getAttribute(attr);
        // 將 kebab-case (chart-data) 轉成 camelCase (chartData) 以符合 React 習慣
        // 或者你可以依據你的習慣，這裡我保留你原本的命名邏輯，手動對應比較安全

        if (rawValue) {
          try {
            // 嘗試解析 JSON，如果是普通字串就直接用
            props[mapAttributeToProp(attr)] = JSON.parse(rawValue);
          } catch (e) {
            props[mapAttributeToProp(attr)] = rawValue;
          }
        }
      });
      return props;
    }

    render() {
      const props = this.getPropsFromAttributes();

      this.root.render(
        <React.StrictMode>
          {/* 把解析好的 props 傳進去 */}
          <ReactComponent {...props} />
        </React.StrictMode>,
      );
    }
  }

  customElements.define(tagName, WebComponentWrapper);
}

// ---------------------------------------------------------
// 2. 輔助函式：屬性名稱對應 (HTML -> React Props)
// ---------------------------------------------------------
function mapAttributeToProp(attr: string): string {
  // 這裡你可以自定義對應規則
  switch (attr) {
    case 'chart-data':
      return 'data'; // HTML傳 chart-data -> React收 data
    case 'config':
      return 'config'; // HTML傳 config -> React收 config
    default:
      return attr;
  }
}

// ---------------------------------------------------------
// 3. 註冊你的組件 (這裡就是要輸出的清單)
// ---------------------------------------------------------

// 註冊電力圖表 <remote-electricity-chart>
registerReactComponent('remote-electricity-chart', ElectricityChart, ['chart-data', 'config']);

// 它接受 chart-data 和 config 兩個屬性
registerReactComponent('remote-pie-chart', PieChart, ['chart-data', 'config']);
