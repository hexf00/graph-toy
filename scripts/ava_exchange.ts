// 将 ava/knowledge 转换为G6格式数据
// 字段参考: https://github.com/antvis/AVA/blob/master/packages/knowledge/zh-CN/USERGUIDE.zh-CN.md
// 也是为了通用的数据导入做准备工作
// 新增导入和合并导入

import avackb from "../data/input/ava"
import * as fs from "fs"

//应该使用UUID替换
let getIdByItem = function (item) {
  return item.label
}


//最终数据
let nodes = [
  {
    id: '数据图表',
    label: '数据图表',
    _type: 'class',
    characteristic: []
  }
]


let data = Object.keys(avackb).filter((chartId) => {
  //过滤掉name为空的情况
  return avackb[chartId].name
}).map((chartId) => {
  let chart = avackb[chartId]

  //做一些字段名称替换
  let mapKey = {
    "description": "def",
    "label": "name",
    "图表分类": "category" //category被使用了,为属种关系
  }
  Object.keys(mapKey).forEach(k => {
    chart[k] = chart[mapKey[k]]
    delete chart[mapKey[k]]
  })

  //添加属种关系
  chart.category = [nodes[0].id]

  return chart
})





let generalConcepts = [];
let generalConceptsDict = {};



//循环chart数据 添加特征节点
data.forEach(chart => {
  //根据chart 的 key构建 特征一般概念
  Object.keys(chart).forEach((k) => {
    //排除保留键
    //dataPres 排除
    if (['id', 'label', 'description', 'dataPres'].indexOf(k) === -1) {




      if (chart[k] instanceof Array) {

        if (!generalConceptsDict[k]) { //不存在则添加特征名称
          generalConceptsDict[k] = generalConcepts.push({
            id: k,
            label: k,
            description: '',//可以从文档中导入
            _type: 'class'
          })

          //同时给 图表个体概念 添加动态特征表单配置
          nodes[0].characteristic.push({
            name: k,
            control: {
              type: 'node' //节点选择器
            }
          })
        }

        //每一个特征值都添加为节点
        chart[k].forEach(v => {
          if (!generalConceptsDict[v]) { //不存在则添加特征名称
            generalConceptsDict[v] = generalConcepts.push({
              id: v,
              label: v,
              description: '',//可以从文档中导入
              category: [k],
              _type: 'class'
            })
          }
        })
      }
    }
  })
})


nodes = nodes.concat(data, generalConcepts)


fs.writeFileSync(__dirname + '/../data/output/ava.json', JSON.stringify({nodes,edges:[]}, null, 2))
