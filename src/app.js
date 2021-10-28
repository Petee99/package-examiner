import Sidebar from './templates/Sidebar'
import Canvas from './templates/Canvas'

/*
 * Sets up the html content using the Sidebar and Canvas templates
 * @returns {node} - a new node from template
 * */

async function App() {
  const template = document.createElement('template')
  template.innerHTML = `
    <div class="container">
      ${Sidebar()}
      ${Canvas()}
    </div>
  `
  return template.content.cloneNode(true)
}

export default App;