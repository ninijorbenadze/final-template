const BASE_URL = 'https://v2.nba.api-sports.io';
const API_KEY = 'd2b793d6c9a8c1e67fa571ea42699ba3';

export async function fetchData(endpoint) {
  try {
    const response = await fetch(
      `${BASE_URL}/teams?search=${endpoint}`, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': 'v2.nba.api-sports.io'
      }
    });

    if (!response.ok) {
      throw new Error(`სერვერის შეცდომა: ${response.status}`);
    }

    const data = await response.json();

    if (!data.response) {
      return [];
    }

    return data.response.map(team => ({
      id: team.id,
      name: team.name,
      city: team.city,
      conference: team.leagues.standard.conference,
      division: team.leagues.standard.division,
      logo: team.logo

    }));
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export function getSaved() {
  const raw = localStorage.getItem('savedItems');
  return raw ? JSON.parse(raw) : [];
}

export function setSaved(items) {
  localStorage.setItem('savedItems', JSON.stringify(items));
}

export async function getAllTeams() {
  try {
    const response = await fetch(
      `${BASE_URL}/teams`, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': 'v2.nba.api-sports.io'
      }
    });
    const data = await response.json();

    console.log(data);


    return data.response
      .filter(team => team.nbaFranchise === true)
      .map(team => ({
        id: team.id,
        name: team.name,
        city: team.city,
        conference: team.leagues.standard.conference,
        division: team.leagues.standard.division,
        logo: team.logo
      }));

  } catch (err) {
    console.error(err);
    return [];
  }
}
export async function getTeamPlayers(teamId) {
  try {
    const response = await fetch(
      `${BASE_URL}/players?team=${teamId}&season=2024`,
      {
        method: 'GET',
        headers: {
          'x-rapidapi-key': API_KEY,
          'x-rapidapi-host': 'v2.nba.api-sports.io'
        }
      }
    );

    const data = await response.json();

    if (!data.response) return [];

    return data.response.map(player => ({
      name: `${player.firstname} ${player.lastname}`,
      position: player.leagues?.standard?.pos || 'N/A',
      number: player.leagues?.standard?.jersey || '-'
    }));

  } catch (err) {
    console.error(err);
    return [];
  }
}