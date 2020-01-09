window.onload = function () {
  const { ipcRenderer } = require('electron');
  const { Notification } = require('electron').remote;
  document.querySelector('.close').addEventListener('click', close);
  document.querySelector('.copy__click').addEventListener('click', copy);

  /** 版本信息显示相关 */
  const package = require('../../../package.json');
  const getMac = require('getmac');
  const macAddress = getMac.default().replace(/:/g, '-').toLocaleUpperCase()
  document.querySelector('.client__version').innerText = package.version;
  document.querySelector('.chrome__version').innerText = process.versions.chrome;
  document.querySelector('.mac').innerText = macAddress;
  
  /** 关闭弹出框 */
  function close() {
    ipcRenderer.send('close');
  }


  /** 复制按钮 */
  function copy() {
    var textArea = document.createElement("textarea");

    window.clearTimeout(window.timer)

    textArea.style.position = 'fixed';
    textArea.style.top = '-999px';
    textArea.style.left = 0;
    textArea.style.width = '1px';
    textArea.style.height = '1px';
    textArea.value = macAddress;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);

    // 提示复制成功，2s后关闭
    document.querySelector('.copy__tips').style.opacity = 1;
    window.timer =  window.setTimeout(() => {
      document.querySelector('.copy__tips').style.opacity = 0;
    }, 2000);

    // const notify = new Notification({
    //   body: `成功复制本机mac地址到剪贴板！`
    // });
    // notify.show();
  }
}