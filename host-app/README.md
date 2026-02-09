# Vue 3 + TypeScript + Vite

Module Federation demo

Node v20.19.3 with Yarn v1.22.22

host-app

import react-chart-lib echarts
import vue-table-lib ant-design-vue

step 1
open react-chart-lib
run yarn
run yarn build
output react-chart-lib.js

step 2
open vue-table-lib
run yarn
run yarn build
output vue-table-lib.js

step3
copy react-chart-lib.js and vue-table-lib.js paste to host-app public/libs folder
run yarn
run yarn dev
