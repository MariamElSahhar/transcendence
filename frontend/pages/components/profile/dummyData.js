// dummyData.js
export const dummyData = {
    userProfile: { username: "Mariam", profilePicture: "/images/sample_profile.jpg" },
    stats: { elo: 1200, winRate: 75, matchesPlayed: 50, friends: 5 },
    matchHistory: [
        { opponent: "PlayerA", date: "2024-01-01", result: "Win", score: "5-3", eloDelta: "+15", winningChance: "65%" },
        { opponent: "PlayerB", date: "2024-01-02", result: "Lose", score: "3-5", eloDelta: "-10", winningChance: "45%" }
    ],
    charts: {
        eloGraph: {
            graph: [
                { date: "2024-01-01", value: 1150 },
                { date: "2024-02-01", value: 1200 }
            ]
        },
        winRateGraph: {
            graph: [
                { date: "2024-01-01", value: 70 },
                { date: "2024-02-01", value: 75 }
            ]
        },
        matchesPlayedGraph: {
            graph: [
                { date: "2024-01-01", value: 5 },
                { date: "2024-02-01", value: 7 }
            ]
        }
    }
};
