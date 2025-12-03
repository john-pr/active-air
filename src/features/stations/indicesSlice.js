import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { giosApi } from "./api.js";

export const fetchIndexByStationId = createAsyncThunk(
  "indices/fetchIndexByStationId",
  async (stationId, { rejectWithValue }) => {
    try {
      const indexResponse = await giosApi.fetchIndexByStationId(stationId);
      return { stationId: String(stationId), indexResponse };
    } catch (e) {
      return rejectWithValue({ stationId: String(stationId), message: e.message });
    }
  },
  {
    condition: (stationId, { getState }) => {
      const state = getState();
      const id = String(stationId);
      if (state.indices.byStationId[id] != null) return false;
      if (state.indices.statusByStationId[id] === "loading") return false;
      return true;
    },
  }
);


const indicesSlice = createSlice({
  name: "indices",
  initialState: {
    byStationId: {},           // { [id]: rawIndexResponse|null }
    statusByStationId: {},     // { [id]: 'idle'|'loading'|'succeeded'|'failed' }
    errorByStationId: {},      // { [id]: string|null }
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchIndexByStationId.pending, (state, action) => {
      const stationId = String(action.meta.arg);
      state.statusByStationId[stationId] = "loading";
      state.errorByStationId[stationId] = null;
    });

    builder.addCase(fetchIndexByStationId.fulfilled, (state, action) => {
      const { stationId, indexResponse } = action.payload;
      state.byStationId[stationId] = indexResponse ?? null;
      state.statusByStationId[stationId] = "succeeded";
    });

    builder.addCase(fetchIndexByStationId.rejected, (state, action) => {
      const payload = action.payload;
      if (!payload?.stationId) return;

      state.byStationId[payload.stationId] = null;
      state.statusByStationId[payload.stationId] = "failed";
      state.errorByStationId[payload.stationId] = payload.message || "error";
    });
  },
});

export default indicesSlice.reducer;
