// 主进程
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

function createWindow() {
  const win = new BrowserWindow({
    width: 400,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      // 官网似乎说是默认false，但是这里必须设置contextIsolation
      contextIsolation: false,
      enableRemoteModule: true,
    },
    title: '超级计算器'
  })
  win.loadFile(path.join(__dirname, './views/index.html'))
  // 打开调试工具
  // win.webContents.openDevTools()
  // 引入菜单模块
  require('./mainProcess/menu')

  // 引入系统托盘模块
  var createTray = require('./mainProcess/tray')
  createTray(win)
  
  // 监听颜色组件传递
  ipcMain.on('setColor', (event, data) => {
    console.log(data);
    // 发送给页面渲染进程
    win.webContents.send('sendColor', data)
  })
}

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})



