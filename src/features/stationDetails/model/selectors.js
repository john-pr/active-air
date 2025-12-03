export const selectDetailsForStation = (state, stationId) =>
  state.stationDetails.byStationId[String(stationId)] ?? null;

export const selectDetailsStatusForStation = (state, stationId) =>
  state.stationDetails.statusByStationId[String(stationId)] ?? "idle";
