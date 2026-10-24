/**
 * Wraps every word under `root` in a `<span class="word">`, keeping inline
 * markup such as nested spans intact. Returns the new word elements.
 */
export function splitWords(root: HTMLElement): HTMLElement[] {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  const nodes: Text[] = []
  while (walker.nextNode()) nodes.push(walker.currentNode as Text)

  const words: HTMLElement[] = []
  for (const node of nodes) {
    const fragment = document.createDocumentFragment()
    for (const part of node.data.split(/(\s+)/)) {
      if (!part) continue
      if (/^\s+$/.test(part)) {
        fragment.append(part)
        continue
      }
      const word = document.createElement('span')
      word.className = 'word'
      word.textContent = part
      words.push(word)
      fragment.append(word)
    }
    node.replaceWith(fragment)
  }
  return words
}
