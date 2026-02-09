import React from 'react';
import ReactDOM from 'react-dom/client';
import { ElectricityChart } from './components/ElectricityChart';
// 引入樣式 (確保編譯時包含)
// import './style.scss';

class RemoteReactChart extends HTMLElement {
  private mountPoint: HTMLDivElement;
  private root: ReactDOM.Root;

  // 監聽外部傳入的屬性
  static get observedAttributes() {
    return ['chart-data', 'config'];
  }

  constructor() {
    super();
    // 使用 Shadow DOM 隔離樣式
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

  render() {
    // 解析屬性
    const dataAttr = this.getAttribute('chart-data');
    const configAttr = this.getAttribute('config');

    const data = dataAttr ? JSON.parse(dataAttr) : [];
    const config = configAttr ? JSON.parse(configAttr) : { contractCapacity: 0 };

    this.root.render(
      <React.StrictMode>
        <ElectricityChart data={data} config={config} />
      </React.StrictMode>,
    );
  }
}

// 註冊 Web Component
if (!customElements.get('remote-react-chart')) {
  customElements.define('remote-react-chart', RemoteReactChart);
}
