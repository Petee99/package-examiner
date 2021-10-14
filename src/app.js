import Sidebar from './components/Sidebar'
import Canvas from './components/Canvas'

async function App() {
  const template = document.createElement('template')
  template.innerHTML = `
    <div class="container">
      ${Sidebar()}
      ${Canvas()}
    </div>
  `
  // Return a new node from template
  return template.content.cloneNode(true)
}

export default App;