const { Menu, BrowserWindow } = require('electron')

const path = require('path')

// 菜单
const template = [
  {
    label: '设置',
    submenu: [
      {
        label: '关于',
        click: (menuItem, browserWindow, event) => {
          // 此时的browserWindow是主窗口
          createRegardWin()
        }
      },
      {
        label: '刷新',
        role: 'reload'
      },
      {
        label: '退出',
        role: 'quit'
      }
    ]
  },
  {
    label: '格式',
    submenu: [
      {
        label: '颜色',
        accelerator: (function () {
          // 判断系统的类型
          if (process.platform == 'darwin') {
            return 'command + shift + c'
          } else {
            return 'control + shift + c'
          }
        })(),
        click: () => {
          set_color()
        }
      },
      {
        label: '字体增大',
        accelerator: 'F10',
        click: (menuItem, win, event) => {
          // 向主进程发送信息
          win.webContents.send('add')
        }
      },
      {
        label: '字体减小',
        accelerator: 'F11',
        click: (menuItem, win, event) => {
          win.webContents.send('dec')
        }
      },
      {
        label: '默认字体',
        accelerator: 'F12',
        click: (menuItem, win, evnet) => {
          win.webContents.send('default')
        }
      }
    ]
  }
]
const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)

// 设置颜色
function set_color() {
  const win = new BrowserWindow({
    width: 400,
    height: 100,
    webPreferences: {
      nodeIntegration: true,
      // 官网似乎说是默认false，但是这里必须设置contextIsolation
      contextIsolation: false,
      enableRemoteModule: true,
    },
    title: '设置颜色'
  })
  win.loadFile(path.join(__dirname, '../views/color.html'))
  // 设置当前窗体不显示菜单项
  win.setMenu(null)
  // 打开调试工具
  //  win.webContents.openDevTools()
}

// 关于弹窗
function createRegardWin() {
  const win = new BrowserWindow({
    width: 250,
    height: 250,
    title: '关于'
  })
  win.loadFile(path.join(__dirname, '../views/about.html'))
  // 设置当前窗体不显示菜单项
  win.setMenu(null)
}