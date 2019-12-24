const builder = require('electron-builder');
const pkg = require('./package.json');

builder.build({
  config: {
    appId: 'release.tingkelai.electron',
    productName: '听客来',
    electronVersion: pkg.electronVersion,
    directories: {
      output: output,
      app: 'dir'
    },
    publish: {
      // provider: 'generic',
      // url: 'https://download.timetask.cn/pc-autoupdate/${os}/${env.CHANNEL}',
      // channel: '${env.CHANNEL}'
    },
    mac: {
      category: 'public.app-category.productivity', //放到生产效率类
      icon: 'res/app.icns',
      type: 'distribution'
    },
    dmg: {
      artifactName: 'rishiqing-mac-${env.CHANNEL}-${version}.${ext}',
      title: '日事清 ${version}',
      contents: [
        {
          x: 30,
          y: 190
        },
        {
          x: 540 - 30 - 90 - 15 - 15,
          y: 190,
          type: 'link',
          path: '/Applications'
        }
      ]
    },
    win: {
      target: [
        {
          target: 'nsis',
          arch: [process.env.ARCH]
        }
      ],
      icon: 'assets/tkl.ico',
      publish: {
        provider: 'generic',
        url: 'https://download.timetask.cn/pc-autoupdate/${os}/${env.ARCH}/${env.CHANNEL}',
        channel: '${env.CHANNEL}'
      }
    },
    nsis: {
      artifactName: '听客来-win-${env.ARCH}-${env.CHANNEL}-${version}.exe',
      shortcutName: '听客来',
      uninstallDisplayName: '听客来 ${version}',
      // guid: 'F4BC9A4A-E09B-465E-BC10-A8921C46E672',
      installerIcon: "assets/tkl.ico",
      uninstallerIcon: "assets/tkl.ico",
      installerHeaderIcon: "assets/tkl.ico",
      createDesktopShortcut: true,
      createStartMenuShortcut: true,
      shortcutName: "听客来",
      allowToChangeInstallationDirectory: true,
      oneClick: false,
      perMachine: false
    },
  }
});