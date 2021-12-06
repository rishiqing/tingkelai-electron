/*
* @Author: buqi
* @Date:   2020-01-14 9:38:45
* @Last Modified by:   buqi
* @Last Modified time: 2020-01-14 9:38:45
* @for: remote copy to aliyun oss
*/
const pkg  = require('./package.json');
const { OSS }  = require('aliyun-sdk');
const path = require('path');

const sourceList = [
  { type: 'mac', key: 'pc-autoupdate/mac/check/release-mac.json' },
  { type: 'ia32', key: 'pc-autoupdate/win/ia32/check/release.json' },
  { type: 'x64', key: 'pc-autoupdate/win/x64/check/release.json' },
];

const copySource = {
  mac: {
    prefix: 'pc-autoupdate/mac',
    list: [
      // `tingkelai-${pkg.version}-mac.zip`,
      `tingkelai-mac-release-${pkg.version}.dmg`,
      `release-mac.json`,
      `release-mac.yml`,
    ]
  },
  ia32: {
    prefix: 'pc-autoupdate/win/ia32',
    list: [
      `tingkelai-win-ia32-release-${pkg.version}.exe`,
      `release.json`,
      `release.yml`,
    ]
  },
  x64: {
    prefix: 'pc-autoupdate/win/x64',
    list: [
      `tingkelai-win-x64-release-${pkg.version}.exe`,
      `release.json`,
      `release.yml`,
    ]
  }
};

const oss = new OSS({
  'accessKeyId': process.env.ALY_OSS_Access_Id,
  'secretAccessKey': process.env.ALY_OSS_Access_Key,
  'endpoint': 'http://oss-cn-hangzhou.aliyuncs.com',
  'apiVersion': '2013-10-15'
});

// 获取详情
const getObject = function (obj) {
  return new Promise(function (resolve, reject) {
    oss.getObject(Object.assign({
      Bucket: 'tingkelai-client'
    }, obj), function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

const copyObject = function (obj) {
  return new Promise(function (resolve, reject) {
    oss.copyObject(Object.assign({
      Bucket: 'tingkelai-client'
    }, obj), function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

const deal = async function () {
  const infoList = [];
  for (let item of sourceList) {
    try {
      const result = await getObject({
        Key: item.key
      });
      infoList.push({
        type: item.type,
        data: JSON.parse(result.Body.toString())
      });
    } catch (e) {}
  }

  console.log('remoteCopy: infoList\n', JSON.stringify(infoList, null, 2))

  for (let item of infoList) {
    if (item && item.data && item.data.version === pkg.version) {
      const copyDetail = copySource[item.type];
      if (!copyDetail) continue;
      for (let file of copyDetail.list) {
        const sourcePath = path.join('/tingkelai-client', copyDetail.prefix, 'check', file).replace(/\\/g, '/')
        console.log('remoteCopy: start copy file ', sourcePath)
        /**
         * 根据已有的beta yml 文件去生成一份加时间戳的 .yml .json 的文件
         * 如： beta-mac_1578904042208.json
         *      beta-mac_1578904042208.yml
         */
        if (/\.json|\.yml$/.test(file)) {
          const result = path.parse(file);
          const base = result.name + '_' + (new Date()).getTime() + result.ext
          const renameSourcePath = path.join('/tingkelai-client', copyDetail.prefix, 'release', file).replace(/\\/g, '/')
          const timeStampPath = path.join(copyDetail.prefix, 'release', base).replace(/\\/g, '/') // 这个地方不能以 '/' 开头，不然会报签名错误
          console.log(`remoteCopy: cache file ${renameSourcePath} to ${timeStampPath}`)
          await copyObject({
            CopySource: renameSourcePath,
            Key: timeStampPath
          });

          console.log(`remoteCopy: success cache file ${renameSourcePath} to ${timeStampPath}`)
        }
        /**
         * copy 的文件 包括但不限于：
         *  如：   beta-mac.json
         *         beta-mac.yml
         *         tingkelai-mac-beta-1.0.1.dmg
         */
        await copyObject({
          CopySource: sourcePath,
          Key: path.join(copyDetail.prefix, 'release', file).replace(/\\/g, '/')
        });

        console.log('remoteCopy: copy success ', sourcePath)
      }
    }
  }
}

console.log('remoteCopy: ', 'start remote copy...')
deal()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
