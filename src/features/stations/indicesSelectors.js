export const selectIndicesById = (state) => state.indices.byStationId;

export const selectIndexForStation = (state, stationId) =>
  state.indices.byStationId[String(stationId)] ?? null;

export const selectIndexStatusForStation = (state, stationId) =>
  state.indices.statusByStationId[String(stationId)] ?? "idle";

export const selectIndexStatusById = (state) =>
  state.indices.statusByStationId;
