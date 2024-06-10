function getTextOfNode(node) {
  if (node.type == "text") return node.data.trim();

  if (node.children && node.children.length > 0)
    return getTextOfNode(node.children[0]);

  return false;
}

module.exports = getTextOfNode;
