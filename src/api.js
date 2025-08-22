import axios from "axios";
const host = window.location.hostname || "127.0.0.1";
const defaultBase = `http://${host}:8000/api`;
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || defaultBase,
});
// Tables
export const listTables = () => api.get("/tables/").then((r) => r.data);
export const createTable = (payload) =>
    api.post("/tables/", payload).then((r) => r.data);
export const updateTable = (id, payload) =>
    api.patch(`/tables/${id}/`, payload).then((r) => r.data);

// Reservations
export const listReservations = (params = {}) =>
    api.get("/reservations/", { params }).then((r) => r.data);
export const createReservation = (payload) =>
    api.post("/reservations/", payload).then((r) => r.data);
export const updateReservation = (id, payload) =>
    api.patch(`/reservations/${id}/`, payload).then((r) => r.data);

// Availability
export const getAvailability = ({ start, end, people }) =>
    api
        .get("/availability/", { params: { start, end, people } })
        .then((r) => r.data);

export default api;
