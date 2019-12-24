const builder = require('electron-builder');
const pkg = require('./package.json');

const output = process.platform === 'darwin' ? `package-${process.env.CHANNEL}` : `package-${process.env.ARCH}-${process.env.CHANNEL}`;
console.log(output)

builder.build({
  config: {
    appId: 'release.tingkelai.electron',
    productName: 'tingkelai',
    electronVersion: pkg.electronVersion,
    directories: {
      output: output,
      // app: 'dir'
    },
    publish: {
      provider: 'generic',
      url: 'https://download.timetask.cn/pc-autoupdate/${os}/${env.CHANNEL}',
      channel: '${env.CHANNEL}'
    },
    mac: {
      category: 'public.app-category.productivity', //放到生产效率类
      icon: 'res/app.icns',
      type: 'distribution'
    },
    dmg: {
      artifactName: 'tingkelai-mac-${env.CHANNEL}-${version}.${ext}',
      title: 'tingkelai ${version}',
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
      artifactName: 'tingkelai-win-${env.ARCH}-${env.CHANNEL}-${version}.exe',
      shortcutName: '听客来',
      uninstallDisplayName: '听客来 ${version}',
      guid: 'BE407C3D-E86D-7273-36F9-69C6E8F9F216',
      installerIcon: "assets/tkl.ico",
      uninstallerIcon: "assets/tkl.ico",
      installerHeaderIcon: "assets/tkl.ico",
      createDesktopShortcut: true,
      createStartMenuShortcut: true,
      allowToChangeInstallationDirectory: true,
      oneClick: false,
      perMachine: false
    },
  }
});