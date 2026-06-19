import { getTeamPlayers } from "./api.js";

console.log("TEAM JS RUNNING");

const params = new URLSearchParams(window.location.search);
const teamId = params.get('id');

console.log('TEAM ID:', teamId);

const teams = JSON.parse(localStorage.getItem('lastTeams')) || [];

const team = teams.find(t => String(t.id) === String(teamId));

if (!team) {
    console.log("TEAM NOT FOUND");
} else {
    document.getElementById('team-name').textContent = team.name;
    document.getElementById('team-logo').src = team.logo;
    document.getElementById('team-city').textContent = `City: ${team.city}`;
    document.getElementById('team-conference').textContent = `Conference: ${team.conference}`;
    document.getElementById('team-division').textContent = `Division: ${team.division}`;
}

const container = document.getElementById('players-container');

async function loadPlayers() {
    try {
        container.innerHTML = '<p>იტვირთება...</p>';

        const players = await getTeamPlayers(teamId);

        if (!players || players.length === 0) {
            container.innerHTML = '<p>Players not found</p>';
            return;
        }

        container.innerHTML = players.map(p => `
            <div class="player-card">
                <p><strong>${p.name}</strong></p>
                <p>Position: ${p.position}</p>
                <p>Jersey: ${p.number}</p>
            </div>
        `).join('');

    } catch (err) {
        console.log("ERROR PLAYERS:", err);
        container.innerHTML = '<p>Error loading players</p>';
    }
}

loadPlayers();