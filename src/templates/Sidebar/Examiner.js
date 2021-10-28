/*
 * Sets up the Examiner Sidebar template
 * @returns {template} - Examiner html template
 * */
const Examiner = () => {
	const template = `
    <h1>Single Package Analysis</h1>

    <form id="packageForm" onsubmit="handleFormEvents(event)">
      <label for="pname">Package Name:</label><br>
      <input class="inputField" type="text" id="pname" name="pname" placeholder="e.g. vue" ><br>
      <input type="submit" value="Search">
    </form> 
    
    <label id="pklabel" for="versionSelect">Package Version:</label><br>
    <select class="inputField" name="versionSelect" id="versionSelect">
      <option value="" selected disabled hidden>Choose version</option>
    </select>

    <form id="graphingForm" onsubmit="handleFormEvents(event)">
      <label for="ddepth">Search Depth: <br><span class="desc">(If left blank:<br> all dependencies will be processed)</span></label><br>
      <input class="inputField" type="number" id="ddepth" name="ddepth" min=1 placeholder="e.g. 5"><br>
      <input type="submit" value="Get dependencies">
    </form>

    <h1>Graph Data:</h1>
    <div id="graphData"></div>
    `;
	return template;
};

export default Examiner;