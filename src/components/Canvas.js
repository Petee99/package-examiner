const Canvas = () => {
	const template = `
    <div class="split canvas">
    <h1 class="canvasTitle">Dependency graph of <b id="dTitle" nowrap>the selected package</b>:</h1>
    <div id="container"></div>    
    </div>
  `;
	return template;
};


export default Canvas;
