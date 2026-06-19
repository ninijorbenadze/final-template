import { fetchData, getSaved, setSaved, getAllTeams} from './api.js';

let allTeams = [ ];
let savedItems = getSaved();




// თუ მომხმარებელი არ არის ავტორიზებული — გადამისამართება login.html-ზე
if (!localStorage.getItem('user')) {
  window.location.href = 'login.html';
}

document.getElementById('nav-user').textContent = localStorage.getItem('user') || '';

document.getElementById('logout-btn').addEventListener('click', () => {
  localStorage.removeItem('user');
  document.cookie = 'authorized=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
  window.location.href = 'login.html';
});

// --- სტეიტი ---

function showLoading() {
  const grid = document.getElementById('results-grid');
  grid.innerHTML = '<p>იტვირთება...</p>';
}

function showError(message) {
  const grid = document.getElementById('results-grid');
  grid.innerHTML = `<p>${message}</p>`;
}

function renderResults(items) {
  const grid = document.getElementById('results-grid');
  grid.innerHTML = '';

  items.forEach(item => {
    const card = document.createElement('article');
    card.className = 'team-card';
    const isSaved = savedItems.some(saved => saved.id === item.id);

    // ბარათის შიგთავსი აქ
    card.innerHTML = `

    <img
  src="${item.logo}"
  alt="${item.name}"
  class="team-logo"
  onerror="this.src='https://placehold.co/100x100?text=NBA'">

      <h3>${item.name}</h3>
      <p><strong>City:</strong> ${item.city}</p>
      <p><strong>Conference:</strong> ${item.conference}</p>
      <p><strong>Division:</strong> ${item.division}</p>

      <button class="save-btn">
        ${isSaved ? 'დამატებულია' : 'ფავორიტებში დამატება'}
      </button>
    `;
    card.addEventListener('click', () => {
      window.location.href = `team.html?id=${item.id}`;
    });

    const saveBtn = card.querySelector('.save-btn');

    saveBtn.addEventListener('click', (e) => {
      e.stopPropagation();

      const exists = savedItems.some(saved => saved.id === item.id);

      if (exists) {
        savedItems = savedItems.filter(saved => saved.id !== item.id);
        saveBtn.textContent = 'ფავორიტებში დამატება';
      } else {
        savedItems.push(item);
        saveBtn.textContent = 'დამატებულია';
      }

      setSaved(savedItems);
      renderResults(allTeams);
    });

    grid.appendChild(card);
  });
}

document.getElementById('search-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const query = document.getElementById('search-input').value.trim();

  if (!query) {
    showError('შეიყვანე გუნდის სახელი');
    return;
  }

  try {
    showLoading();

    const data = await fetchData(query);

    renderResults(data);
  } catch (error) {
    console.error(error);
    showError('მონაცემების წამოღება ვერ მოხერხდა');
  }
});

function applyfilters() {
  const query = document.getElementById('search-input').value.trim();
  const conference = document.getElementById('conference-filter').value;
  const onlyChampions = document.getElementById('champs-filter').checked;

  let filtered = allTeams;

  if (query) {
    filtered = filtered.filter(team =>
      team.name.includes(query)
    );
  }

  if (conference !== 'all') {
    filtered = filtered.filter(team =>
      team.conference === conference
    );
  }

  if (onlyChampions) {
    const champions = [
      'Boston Celtics',
      'Los Angeles Lakers',
      'Golden State Warriors',
      'Chicago Bulls',
      'San Antonio Spurs',
      'Miami Heat',
      'Detroit Pistons',
      'Philadelphia 76ers',
      'New York Knicks',
      'Houston Rockets',
      'Milwaukee Bucks',
      'Cleveland Cavaliers',
      'Dallas Mavericks',
      'Toronto Raptors',
      'Denver Nuggets',
      'Oklahoma City Thunder',
      'Washington Wizards',
      'Portland Trail Blazers',
      'Atlanta Hawks',
      'Sacramento Kings'
    ];

    filtered = filtered.filter(team => 
      champions.includes(team.name)
    );
  }
  renderResults(filtered);
}

document.getElementById('search-input').addEventListener('input', applyfilters);

document.getElementById('conference-filter')
  .addEventListener('change', applyfilters);

document.getElementById('champs-filter')
  .addEventListener('change', applyfilters);


window.addEventListener('load', async () => {
  try {
    showLoading();

    allTeams = await getAllTeams();
    localStorage.setItem(
  'lastTeams',
  JSON.stringify(allTeams)
);

    console.log('ALL TEAMS:', allTeams.length);

    renderResults(allTeams);

  } catch (e) {
    console.log(e);
    showError('გუნდების ჩატვირთვა ვერ მოხერხდა');
  }
});