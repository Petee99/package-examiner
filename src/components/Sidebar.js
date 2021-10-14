import { submitForm } from "../js/handleSidebarEvents";

const Sidebar = () => {
	const template = `
    <div class="split sidebar">

    <h1>Package Examiner</h1>  

    <label for="togBtn">Canvas DarkMode</label><br>
    <label id="darkmode" class="switch">
    <input type="checkbox" id="togBtn" onclick="toggleDarkMode()" checked>
    <div class="slider round"></div>
    </label>  

    <form id="packageForm" onsubmit="handleFormEvents(event)">
      <label for="pname">Package Name:</label><br>
      <input type="text" id="pname" name="pname" placeholder="e.g. vue"><br>
      <input type="submit" value="Select">
    </form> 
    
    <label id="pklabel" for="versionSelect">Package Version:</label><br>
    <select name="versionSelect" id="versionSelect">
      <option value="" selected disabled hidden>Choose version</option>
    </select>

    <form id="graphingForm" onsubmit="handleFormEvents(event)">
      <label for="ddepth">Search Depth: <br><span class="desc">(If left blank:<br> all dependencies will be processed)</span></label><br>
      <input type="number" id="ddepth" name="ddepth" min=1 placeholder="e.g. 5"><br>
      <input type="submit" value="Get dependencies">
    </form>

    <h1>Graph Data:</h1>
    <div id="graphData"></div>
    </div>
  `;
	return template;
};

window.handleFormEvents = (event) => {
  event.preventDefault();
  submitForm(event.target.id);
};

window.toggleDarkMode = () => {
  var checkBox = document.getElementById("togBtn");
  if (checkBox.checked == true){
    document.getElementsByClassName("canvas")[0].style.backgroundColor = "rgb(31, 31, 31)";
    document.getElementsByClassName("canvasTitle")[0].style.color = "#ccc";
    
  } else {
    document.getElementsByClassName("canvas")[0].style.backgroundColor = "white";
    document.getElementsByClassName("canvasTitle")[0].style.color = "rgb(43, 43, 43)";
  }
}

export default Sidebar;
