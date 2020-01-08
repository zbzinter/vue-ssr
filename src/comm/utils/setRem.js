//  设置html fontsize
export default function setRem(maxWidth = 750) {
  let toSetRem = () => {
    let htmlEle = document.querySelector('html')
    let docWidth = document.documentElement.clientWidth
    let realWidth = docWidth > maxWidth
      ? maxWidth
      : docWidth
    htmlEle.style.fontSize = realWidth / 7.5 + 'px'
  }
  toSetRem()
  window.addEventListener('resize', toSetRem, false)
}