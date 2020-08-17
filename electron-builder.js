const builder = require('electron-builder');
const pkg = require('./package.json');

const output = process.platform === 'darwin' ? `package-${process.env.CHANNEL}` : `package-${process.env.ARCH}-${process.env.CHANNEL}`;

builder.build({
  config: {
    appId: 'release.tingkelai.electron',
    // 立聪堂定制exe名称
    productName: 'tingkelai-for-listentown',
    electronVersion: pkg.electronVersion,
    directories: {
      output: output,
      // app: 'src',  // electron 默认打包的文件夹入口
    },
    files: [
      'src/**',
      'node_modules/**/*',
      'package.json',
      'electron-builder.js',
      'main.js',
      // 'travis.sh',
    ],
    publish: {
      provider: 'generic',
      url: 'https://download.tingkelai.com/pc-autoupdate/${os}/${env.CHANNEL}',
      channel: '${env.CHANNEL}'
    },
    mac: {
      category: 'public.app-category.productivity', //放到生产效率类
      icon: 'src/assets/tkl.ico',
      type: 'distribution',
      target: ['dmg']
    },
    dmg: {
      // 立聪堂定制版安装文件有listentown后缀名
      artifactName: 'tingkelai-mac-${env.CHANNEL}-${version}-listentown.${ext}',
      background: 'src/assets/dmg-bg.png',
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
      ],
      window: {
        width: 540,
        height: 380,
      }
    },
    win: {
      target: [
        {
          target: 'nsis',
          arch: [process.env.ARCH]
        }
      ],
      // certificateSubjectName: '南京听客来信息技术有限公司',
      // certificateSha1: 'C62F13BAC984C857370B22DB8550B58002180D81',
      icon: 'src/assets/tkl.ico',
      publish: {
        provider: 'generic',
        url: 'https://download.tingkelai.com/pc-autoupdate/${os}/${env.ARCH}/${env.CHANNEL}',
        channel: '${env.CHANNEL}'
      }
    },
    nsis: {
      // 立聪堂定制版安装文件有listentown后缀名
      artifactName: 'tingkelai-win-${env.ARCH}-${env.CHANNEL}-${version}-listentown.exe',
      shortcutName: '听客来',
      uninstallDisplayName: '听客来 ${version}',
      guid: 'BE407C3D-E86D-7273-36F9-69C6E8F9F216',
      installerIcon: "src/assets/tkl.ico",
      uninstallerIcon: "src/assets/tkl.ico",
      installerHeaderIcon: "src/assets/tkl.ico",
      createDesktopShortcut: true,
      createStartMenuShortcut: true,
      allowToChangeInstallationDirectory: true,
      oneClick: false,
      perMachine: true // 与 oneClick 组合使用，出现不同的安装情况
    },
  }
});