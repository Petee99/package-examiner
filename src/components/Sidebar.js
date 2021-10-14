import { submitForm } from "../js/handleSidebarEvents";

const Sidebar = () => {
	const template = `
    <div class="split sidebar">
              
    <h1>Package Examiner</h1>

    <form id="packageForm" onsubmit="handleFormEvents(event)">
      <label for="pname">Package Name:</label><br>
      <input type="text" id="pname" name="pname" placeholder="e.g. vue"><br>
      <input type="submit" value="Select">
    </form> 
    
    <label for="versionSelect">Package Version:</label><br>
    <select name="versionSelect" id="versionSelect">
      <option value="" selected disabled hidden>Choose version</option>
    </select>

    <form id="graphingForm" onsubmit="handleFormEvents(event)">
      <label for="ddepth">Depth: <br><span class="desc">(If left blank the whole tree will be processed)</span></label><br>
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

export default Sidebar;
