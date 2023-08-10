const leaderboardBody = document.getElementById('leaderboard-body');

fetch('scanned_data_log.csv')
    .then(response => response.text())
    .then(data => {
        const rows = data.split('\n');
        const nameDataMap = new Map();

        rows.forEach(row => {
            const [dateTime, idNumber, name, totalTime, lapTime, lapRound] = row.split(',');
            if (!nameDataMap.has(name)) {
                nameDataMap.set(name, {
                    total: parseFloat(totalTime),
                    rounds: parseInt(lapRound),
                    lastLapRound: parseInt(lapRound),
                    data: []
                });
            }
            nameDataMap.get(name).data.push({ totalTime, lapTime, lapRound });
            nameDataMap.get(name).lastLapRound = parseInt(lapRound);
        });

        const sortedNames = Array.from(nameDataMap.keys()).sort((a, b) => {
            const aData = nameDataMap.get(a);
            const bData = nameDataMap.get(b);

            // Compare last lap round first
            if (aData.lastLapRound !== bData.lastLapRound) {
                return bData.lastLapRound - aData.lastLapRound; // Higher lap round first
            }

            // If last lap round is the same, compare by last total time
            const aLastTotalTime = parseFloat(aData.data[aData.data.length - 1].totalTime);
            const bLastTotalTime = parseFloat(bData.data[bData.data.length - 1].totalTime);

            return aLastTotalTime - bLastTotalTime; // Lower last total time first
        });

        sortedNames.forEach(name => {
            const data = nameDataMap.get(name);
            data.data.forEach((entry, index) => {
                const newRow = `
                    <tr>
                        ${index === 0 ? `<td rowspan="${data.data.length}">${name}</td>` : ''}
                        <td>${entry.totalTime}</td>
                        <td>${entry.lapTime}</td>
                        <td>${entry.lapRound}</td>
                    </tr>`;
                leaderboardBody.insertAdjacentHTML('beforeend', newRow);
            });
        });
    });

// Rest of your code

