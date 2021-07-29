// 设置颜色

const { ipcRenderer } = require('electron')

let colorBtn = document.querySelector('#box')

colorBtn.onclick = function(e){
  let color = e.target.dataset.color
  ipcRenderer.send('setColor', color)
}