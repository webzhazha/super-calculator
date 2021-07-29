const { ipcRenderer } = require('electron')
const math = require('mathjs')
let resultText = document.querySelector('.result-text')

// 还原配置项
if (localStorage.getItem('configColor')) {
  resultText.style.color = localStorage.getItem('configColor')
}
if (localStorage.getItem('configSize')) {
  resultText.style.color = localStorage.getItem('configSize') + 'px'
}


// 接收颜色
ipcRenderer.on('sendColor', (event, data) => {
  resultText.style.color = data
  localStorage.setItem('configColor', data)
})

// 该进程接收数据
ipcRenderer.on('add', () => {
  let fs = window.getComputedStyle(resultText, null).fontSize
  let newFs = fs.replace('px', '') - 0 + 2
  if (newFs > 80) {
    return
  }
  resultText.style.fontSize = newFs + 'px'
  localStorage.setItem('configSize', newFs)
})
ipcRenderer.on('dec', () => {
  let fs = window.getComputedStyle(resultText, null).fontSize
  let newFs = fs.replace('px', '') - 0 - 2
  if (newFs < 12) {
    return
  }
  resultText.style.fontSize = newFs + 'px'
  localStorage.setItem('configSize', newFs)
})
ipcRenderer.on('default', () => {
  resultText.style.fontSize = '50px'
  localStorage.setItem('configSize', 50)
})

// 计算方法
// 记录变量计算的值
let result = ''
let main = {
  // 是否按过了算法键
  isCalc: false,
  // 选中数字
  clickNum(num) {
    if (result.includes('.') && num === '.') {
      return
    }
    // 如果按了算法键  填入  如果没有 累加
    result = result + num.toString()
    if (this.isCalc) {
      resultText.innerText = num
    } else {
      resultText.innerText = result
    }
  },
  // 计算
  calc() {
    resultText.innerText = math.format(math.evaluate(result), 4)
    this.isCalc = false
    result = ''
  },
  // 重置
  reset() {
    result = ''
    resultText.innerText = 0
    this.isCalc = false
  },
  // 计算方法
  clickopt(method) {
    if (this.isCalc) {
      return
    }
    switch (method) {
      case 'DEL':
        // 删除一个
        let curVals = resultText.innerText
        if (curVals) {
          result = result.substr(0, result.length - curVals.length)
          result = result + curVals.substring(0, curVals.length - 1)
          resultText.innerText = curVals.substring(0, curVals.length - 1)
        }
        break;
      case '%':
        // 百分号
        let curVal = resultText.innerText
        result = result.substr(0, result.length - curVal.length)
        result = result + math.format(math.evaluate(curVal / 100), 4)
        resultText.innerText = math.format(math.evaluate(curVal / 100), 4)
        break;
      default:
        this.isCalc = true
        result = result + method
        break;
    }
  }
}