
const { app, BrowserWindow, globalShortcut, Menu, ipcMain, dialog, Notification, BrowserView } = require('electron')
const { autoUpdater } = require("electron-updater")
const path = require('path')
var package = require("./package.json")

// 保持对window对象的全局引用，如果不这么做的话，当JavaScript对象被
// 垃圾回收的时候，window对象将会自动的关闭
let win
let child

function createWindow () {
  // 创建浏览器窗口。
  win = new BrowserWindow({
    width: 1460,
    height: 1000,
    minWidth: 1300,
    minHeight: 800,
    icon: 'src/assets/favicon.icns',
    webPreferences: {
      nodeIntegration: true // 是否集成Node：默认不开启。不开启的话，node有关系的代码无法识别。
    },
  })
  // new BuildMenu(win)
  Menu.setApplicationMenu(setApplicationMenuTemplate())

  // 加载index.html文件
  // win.loadURL('https://www.tingkelai.com/tingkelai/')
  win.loadURL('https://test.tingkelai.com/tingkelai/login')
  // win.loadURL('http://127.0.0.1:90/tingkelai/login')

  // 当 window 被关闭，这个事件会被触发。
  win.on('closed', () => {
    // 取消引用 window 对象，如果你的应用支持多窗口的话，
    // 通常会把多个 window 对象存放在一个数组里面，
    // 与此同时，你应该删除相应的元素。
    win = null
  })
  
  child = new BrowserWindow({ 
    parent: win, 
    modal: true, 
    show: false, 
    frame: false, 
    width: 620,
    height: 360,
    minWidth: 620,
    minHeight: 330,
    resizable: false,
    webPreferences: {
      nodeIntegration: true // 是否集成Node：默认不开启。不开启的话，node有关系的代码无法识别。
    }, 
  })
  child.loadFile('./src/pages/about/versionMessage.html')
  child.webContents.openDevTools()
}

// Electron 会在初始化后并准备
// 创建浏览器窗口时，调用这个函数。
// 部分 API 在 ready 事件触发后才能使用。
app.on('ready', () => {
  createWindow()
  registerShortcut()
  autoUpdata()
  setContextmenu(win.webContents)
  isDomReady(win.webContents)
  setTheLock()
})

// 当全部窗口关闭时退出。
app.on('window-all-closed', () => {
    // 注销所有快捷键
    globalShortcut.unregisterAll()

  // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
  // 否则绝大部分应用及其菜单栏会保持激活。
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // 在macOS上，当单击dock图标并且没有其他窗口打开时，
  // 通常在应用程序中重新创建一个窗口。
  if (win === null) {
    createWindow()
  }
})

ipcMain.on('close', () => {
  child.hide()
})

/** 当运行第二个实例时 */
function setTheLock() {
  const gotTheLock = app.requestSingleInstanceLock() // 此方法的返回值表示你的应用程序实例是否成功取得了锁。 return Boolean
  if (!gotTheLock) {
    // 没有取得锁，则关闭应用
    app.quit()
  } else {
    app.on('second-instance', () => {
      // 当运行第二个实例时,则打开第一个实例
      if (win) {
        win.focus()
      }
    })
  } 
}

/** 在实例加载成功后，执行的脚本 */
function behindInstanceJavaScript(contents) {
  contents.executeJavaScript(`
    const getMac = require('getmac');
    window.isElectron = true
    window.mac = getMac.default().replace(/:/g, '-');
    console.log(getMac.default().replace(/:/g, '-').toLocaleUpperCase())

    // console.log(getMac.default())
    // const os = require('os')
    // const networkInterfaces = os.networkInterfaces();
    // console.log(networkInterfaces)
    // const list = networkInterfaces.WLAN
    // console.log(list)
    // if (list && list.length > 0) window.mac = list[0].mac.replace(/:/g, '-')
    // console.log(list[0].mac.replace(/:/g, '-'))
  `)
}

/** 注册快捷键 */
function registerShortcut() {
  globalShortcut.register('CommandOrControl+I', () => {
    // 打开开发者工具
    win.webContents.openDevTools()
  })

  if (!globalShortcut.isRegistered('CommandOrControl+I')) {
    globalShortcut.register('CommandOrControl+P', () => {
      // 打开开发者工具
      win.webContents.openDevTools()
    })
  }

}

/** 设置菜单栏 */
function setApplicationMenuTemplate() {
  const template = [
    {
      label: '关于',
      click: () => {
        aboutDialog()
      }
    },
  ]
  return Menu.buildFromTemplate(template)
}

/**设置右击菜单栏 */
function setMenuTemplate() {
  const template = [
    {
      label: '复制',
      role: 'copy',
    },
    { type: 'separator' },
    {
      label: '粘贴',
      role: 'paste',
    },
    { type: 'separator' },
    {
      label: '刷新',
      role: 'reload',
    }
  ]

  return Menu.buildFromTemplate(template)
}

/** 右击事件 */
function setContextmenu(contents) {
  contents.on('context-menu', (e, params) => {
    e.preventDefault()
    const menu = setMenuTemplate()
    menu.popup()
  })
}

/** webcontents dom加载完成后调用 */
function isDomReady(contents) {
  contents.on('dom-ready', () => {
    behindInstanceJavaScript(contents)
  })
}

/** 显示更新弹框 */
function autoUpdata() {
  autoUpdater.checkForUpdates()
  // autoUpdater.on('update-downloaded', function (info) {
  //   const notify = new Notification({
  //     title: `听客来V${info.version} 已准备就绪！`,
  //     body: `请退出当前应用，以便完成更新！`
  //   });
  //   notify.show();
  // });


  // autoUpdater.on('update-available', () => {
  //   const notify = new Notification({
  //     title: `有更新`,
  //     body: `有更新`
  //   });
  //   notify.show();
  // })
}

/** 显示关于dialog */
function aboutDialog() {
  child.show()
}