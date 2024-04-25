import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

// // 获取屏幕宽度并计算根元素的字体大小
// function setRootFontSize() {
//   const screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
//   const rootFontSize = screenWidth / 10; // 假设设计稿宽度为750px，将屏幕宽度分成10份
//   document.documentElement.style.fontSize = rootFontSize + 'px';
// }

// // 监听窗口大小变化，重新计算根元素的字体大小
// window.addEventListener('resize', setRootFontSize);

// // 页面加载完成后，初始化根元素的字体大小
// window.addEventListener('DOMContentLoaded', setRootFontSize);

createApp(App).mount('#app')
