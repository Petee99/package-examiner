import { submitForm } from "../scripts/handleSidebarEvents";
import { drawGraph } from "../scripts/graphing/calculateGraphData";
import Examiner from "./Sidebar/Examiner";
import Statistics from "./Sidebar/Statistics";

const Sidebar = () => {
	const template = `
    <div class="split sidebar">

    <h1>Package Examiner</h1> 
    <button onclick="toggleMode()">Switch Mode</button><br>

    <label for="togBtn">Canvas DarkMode</label><br>
    <label id="darkmode" class="switch">
    <input type="checkbox" id="togBtn" onclick="toggleDarkMode()" checked>
    <div class="slider round"></div>
    </label><br>
    
    <div id="SidebarContent" name="Examiner">${Examiner()}</div>

    </div>
  `;
	return template;
};

window.toggleMode = () => {
  if (document.getElementById("SidebarContent").getAttribute("name") == "Examiner"){
    document.getElementById("SidebarContent").innerHTML = `${Statistics()}`;
    document.getElementById("SidebarContent").setAttribute("name", "Statistics");
    document.getElementsByClassName("canvasTitle")[0].innerHTML = `Statistical analysis of the checked packages:`;
  } else {
    document.getElementById("SidebarContent").innerHTML = `${Examiner()}`;
    document.getElementById("SidebarContent").setAttribute("name", "Examiner");
    document.getElementsByClassName("canvasTitle")[0].innerHTML = `Dependency graph of <b id="dTitle" nowrap>the selected package</b>:`;
  }
  document.getElementById("container").innerHTML="";
}

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
