const Statistics = () => {
	const template = `
    <h1>Statistical analysis of many packages</h1>

    <form id="statForm" onsubmit="handleFormEvents(event)">
        <label for="pQuantity">How many packages to check:</label><br>
        <input type="number" id="pQuantity" name="pQuantity" min=1 placeholder=""><br>
    
        <label for="pSort">Sort packages by:</label><br>
        <select name="pSort" id="pSort">
          <option value="dependent_repos_count">Most Used</option>
          <option value="stars">Stars</option>
          <option value="created_at">Newest</option>
          <option value="rank">SourceRank</option>
          <option value="dependents_count">Dependents</option>
          <option value="latest_release_published_at">Latest Release</option>
          <option value="contributions_count">Contributors</option>
        </select><br>

        <label for="pOrder">In what order should they be checked:</label><br>
        <select name="pOrder" id="pOrder">
          <option value="descending">Descending</option>
          <option value="ascending">Ascending</option>
        </select>

        <input type="submit" value="Check Packages">
    </form>
  `;
	return template;
};

export default Statistics;