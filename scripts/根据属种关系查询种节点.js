//找到 属节点
let classNode = dataLayer.data.nodes.find(node=>node.label == config.name)

//找 种关系 是 属节点ID 的节点
return dataLayer.data.nodes.filter((node)=> {
//  console.log(node.category == classNode.id , node.category,classNode.id)
   return node.category == classNode.id
})
