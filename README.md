# Vue 3 + TypeScript + Vite

Module Federation demo

demo site
https://micro-frontend-demo-mu.vercel.app

Node v20.19.3 with Yarn v1.22.22

## step 1

open react-chart-lib

run yarn

run yarn build

output react-chart-lib.js

## step 2

open vue-table-lib

run yarn

run yarn build

output vue-table-lib.js

## step3

open host-app

copy react-chart-lib.js and vue-table-lib.js paste to host-app public/libs folder

run yarn

run yarn dev
