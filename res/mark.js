/**
 * 用于HTML文本标注的字符串替换函数
 * @author hexf00
 * @version 0.1.0
 * @param {string} str HTML字符串
 * @param {regexp|string} regexp 被替换的内容
 * @param {object|function} replace 替换的内容
 */
function mark(str, regexp, replace) {

  let chuli = (str) => {
    if (typeof replace === 'function') {
      return replace(str) //处理
    } else { //object
      let node
      if ($(str)[0]) {
        node = $(str)
      } else {
        node = $('<span>' + str + '</span>')
      }
      if (replace.html) {
        node.html(replace.html)
      }
      if (replace.class) {
        node.addClass(replace.class)
      }
      if (replace.title) {
        node.attr('title', (node.attr('title') ? node.attr('title') + "\n" : '') + replace.title)
      }
      if (replace.data) {
        for(let i in replace.data){
          node.attr(`data-${i}`,replace.data[i])
        }
        // node.attr('title', (node.attr('title') ? node.attr('title') + "\n" : '') + replace.title)
      }
      return node.prop('outerHTML')
    }
  }


  let left = ''
  if (typeof regexp === 'string') {
    regexp = new RegExp('(\<[^<\/]*?\>){0,1}' + regexp + '(\<\/.*?\>){0,1}')
  }
  while (r = regexp.exec(str)) {

    if ((r[1] && r[2]) || (!r[1] && !r[2])) {
      // console.log(str.substr(0, r.index)) //左边的字符串  =>   <h2>编程的智慧</h2><h3 id="反复  

      // console.log()
      if ((r[1] && r[2])) { //正常标签组
        left += str.substr(0, r.index)
        left += chuli(r[0])
        str = str.substr(r.index + r[0].length)
      } else if ((!r[1] && !r[2])) { //只有字符串
        let zuobian = str.substr(0, r.index)
        let tagStartIndex = zuobian.lastIndexOf('<')
        let tagEndIndex = zuobian.lastIndexOf('>')


        if (tagStartIndex === -1 && tagEndIndex === -1) {
          left += str.substr(0, r.index)
          left += chuli(r[0])
          str = str.substr(r.index + r[0].length)
        } else if (tagStartIndex < tagEndIndex) { //正常标签
          if (zuobian.indexOf('<span', tagStartIndex) === -1) { //非mark标签
            left += str.substr(0, r.index)
            left += chuli(r[0])
            str = str.substr(r.index + r[0].length)
          } else { //mark标签内部，不可继续mark，主要针对删除线，如果是笔记是可以进行嵌套mark的
            left += str.substr(0, str.indexOf('>', r.index) + 1)
            str = str.substr(str.indexOf('>', r.index) + 1)
          }
        } else {
          //不正常的标签
          left += str.substr(0, str.indexOf('>', r.index) + 1)
          str = str.substr(str.indexOf('>', r.index) + 1)
        }
      }


      // console.log(str.substr(0, r.index))


      // if ((!r[1] && !r[2]) && (
      //     str.substr(0, r.index).lastIndexOf('<') !== -1 &&
      //     (
      //       (
      //         str.substr(0, r.index).lastIndexOf('>') !== -1 &&
      //         str.substr(0, r.index).lastIndexOf('<') > str.substr(0, r.index).lastIndexOf('>')
      //       ) || str.substr(0, r.index).lastIndexOf('>') === -1
      //     )
      //   )) {
      //   //标签未结束 不修改attr内容

      //   //同时找到闭合标签关闭这个搜索

      //   // console.log('~~~~~~',str.substr(0, r.index + r[0].length))

      //   // console.log(str.substr(str.indexOf('>',r.index)+1))

      //   left += str.substr(0, str.indexOf('>', r.index) + 1)
      //   str = str.substr(str.indexOf('>', r.index) + 1)






      // } else {
      //   left += str.substr(0, r.index)
      //   left += chuli(r[0])
      //   str = str.substr(r.index + r[0].length)
      // }
    } else {

      if (r[0].indexOf('span') !== -1) {
        //跳过span  <span>葡萄皮</span>  匹配葡萄结果是 <span>葡萄 ，则不参加标注了
        left += str.substr(0, r.index + r[0].length)
        str = str.substr(r.index + r[0].length)
        continue
      } else {
        //不跳过span以外的标签

        if (r[1]) {
          //<块标签>葡萄皮 r[1] exist


          left += str.substr(0, r.index)
          left += r[1]
          left += chuli(r[0].substr(r[1].length))



          str = str.substr(r.index + r[0].length)

          // console.log(r,chuli(r[0].substr(r[1].length)))
          continue

          // console.log(left)
          // left += chuli(r[0].substr(0, r[0].length - r[2].length))
          // left += str.substr(0, r.index + r[0].length)

        } else if (r[2]) {
          //葡萄皮</块标签> r[2] exist
          // console.log(r)

          left += str.substr(0, r.index)
          left += chuli(r[0].substr(0, r[0].length - r[2].length))
          left += r[2]

          str = str.substr(r.index + r[0].length)

          continue
        }

        // continue
      }
    }


  }
  left += str
  return left
}

// 以下代码是为了同时兼容Node和浏览器环境
(function (global, factory) {
  if (typeof module === "object" && typeof module.exports === "object") {
    module.exports = factory(global, true)
  } else {
    factory(global);
  }
})(typeof window !== "undefined" ? window : this, function (window, isNode) {
  if (isNode) {
    return {
      mark
    }
  }
})