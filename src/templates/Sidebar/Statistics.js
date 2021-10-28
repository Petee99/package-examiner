/*
 * Sets up the Statistics Sidebar template
 * @returns {template} - Statistics html template
 * */
const Statistics = () => {
	const template = `
    <h1>Statistical analysis of many packages</h1>

    <h5>Please keep in mind, that the process can take several minutes, up to hours, depending on the sample size.<br><br>
        <i>Min sample size: 1<br>
        Max sample size: 1000</i></h5>

    <form id="statForm" onsubmit="handleFormEvents(event)">
        <label for="pQuantity">How many packages to check:</label><br>
        <input class="inputField" type="number" id="pQuantity" name="pQuantity" min=1 max=1000 placeholder=""><br>
    
        <label for="pSort">Sort packages by:</label><br>
        <select name="pSort" id="pSort" class="inputField">
          <option value="dependent_repos_count">Most Used</option>
          <option value="stars">Stars</option>
          <option value="created_at">Newest</option>
          <option value="rank">SourceRank</option>
          <option value="dependents_count">Dependents</option>
          <option value="latest_release_published_at">Latest Release</option>
          <option value="contributions_count">Contributors</option>
        </select><br>

        <input type="submit" value="Check Packages">
    </form>
  `;
	return template;
};

export default Statistics;