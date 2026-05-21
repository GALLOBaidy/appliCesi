import * as svc from "../services/stats.service.js";
export const totalUsers = async (req, res) => {
    const total = await svc.getTotalUsers();
    res.json({ totalUsers: total });
};
export const totalRuns = async (req, res) => {
    const total = await svc.getTotalRuns();
    res.json({ totalRuns: total });
};
export const runsByDay = async (req, res) => {
    const rows = await svc.getRunsByDay();
    res.json(rows);
};
export const feelingsStats = async (req, res) => {
    const rows = await svc.getFeelingsStats();
    res.json(rows);
};
