document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('votingForm');
  const voteCountElement = document.getElementById('voteCount');
  const monitorSelect = document.getElementById('monitorName');
  const votesList = document.getElementById('votesList');
  const monitorCountsList = document.getElementById('monitorCounts');

  // Function to create a delete button
  function createDeleteButton(id) {
      const button = document.createElement('button');
      button.textContent = 'Delete';
      button.style.marginLeft ="100px";
      button.style.borderRadius = "10px"
      button.style.backgroundColor = 'red'
      button.addEventListener('click', function () {
          // Delete vote from CRUD CRUD API
          fetch(`https://crudcrud.com/api/b9a4b126a1d24983b885a908ba69deff/studentvoting/${id}`, {
              method: 'DELETE',
          })
          .then(() => {
              // Fetch updated votes and refresh display
              fetchVotesAndUpdateDisplay();
          });
      });
      return button;
  }

  // Fetch current votes count from CRUD CRUD API
  fetchVotesAndUpdateDisplay();

  // Fetch list of monitors and populate the dropdown
  fetch('https://crudcrud.com/api/b9a4b126a1d24983b885a908ba69deff/monitors')
      .then(response => response.json())
      .then(data => {
          data.forEach(monitor => {
              const option = document.createElement('option');
              option.textContent = monitor.name;
              monitorSelect.appendChild(option);
          });
      });

  form.addEventListener('submit', function (event) {
      event.preventDefault();
      const studentName = document.getElementById('studentName').value;
      const monitorName = document.getElementById('monitorName').value;

      // Send vote data to CRUD CRUD API
      fetch('https://crudcrud.com/api/b9a4b126a1d24983b885a908ba69deff/studentvoting', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ studentName, monitorName }),
      })
      .then(response => response.json())
      .then(() => {
          // Update vote count after successful submission
          fetchVotesAndUpdateDisplay();
      });

      // Clear input fields after submission
      document.getElementById('studentName').value = '';
      document.getElementById('monitorName').value = '';
  });

  function fetchVotesAndUpdateDisplay() {
      fetch('https://crudcrud.com/api/b9a4b126a1d24983b885a908ba69deff/studentvoting')
          .then(response => response.json())
          .then(data => {
              updateVoteCount(data.length);
              displayVotes(data);
              displayMonitorCounts(data);
          });
  }

  function updateVoteCount(count) {
      voteCountElement.innerText = `Total Votes: ${count}`;
  }

  function displayVotes(votes) {
      votesList.innerHTML = ''; // Clear existing votes

      votes.forEach(vote => {
          const voteItem = document.createElement('li');
          voteItem.textContent = `${vote.studentName} voted for ${vote.monitorName}`;
          const deleteButton = createDeleteButton(vote._id); // Pass vote ID for deletion
          voteItem.appendChild(deleteButton);
          votesList.appendChild(voteItem);
      });
  }

  function displayMonitorCounts(votes) {
      // Create a map to store monitor counts
      const monitorCounts = new Map();

      // Count votes for each monitor
      votes.forEach(vote => {
          const monitorName = vote.monitorName;
          monitorCounts.set(monitorName, (monitorCounts.get(monitorName) || 0) + 1);
      });

      // Clear existing monitor counts
      monitorCountsList.innerHTML = '';

      // Display monitor counts
      monitorCounts.forEach((count, monitorName) => {
          const countItem = document.createElement('li');
          countItem.textContent = `${monitorName}: ${count} votes`;
          monitorCountsList.appendChild(countItem);
      });
  }
});
