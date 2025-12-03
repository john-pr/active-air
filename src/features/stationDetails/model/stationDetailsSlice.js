import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { stationDetailsApi } from "./api.js";

function pickLatestValue(sensorDataResponse) {
  const valuesArray =
    sensorDataResponse?.["Lista danych pomiarowych"] ??
    sensorDataResponse?.values ??
    [];

  const firstNonNull = valuesArray.find((item) => {
    const vPolish = item?.["Wartość"];
    const vEnglish = item?.value;
    return vPolish != null || vEnglish != null;
  });

  if (!firstNonNull) return null;

  return firstNonNull?.["Wartość"] ?? firstNonNull?.value ?? null;
}


export const fetchStationDetails = createAsyncThunk(
  "stationDetails/fetchStationDetails",
  async (stationId, { rejectWithValue }) => {
    try {
      const sensorsResponse = await stationDetailsApi.fetchSensors(stationId);

      const sensorsArray = sensorsResponse?.["Lista stanowisk pomiarowych dla podanej stacji"] ?? [];
    
    function getParamCode(sensor) {
    return (
        sensor?.["Wskaźnik - kod"] ??
        sensor?.["Wskaźnik - wzór"] ??
        ""
    ).toUpperCase();
    }

    const pm10Sensor = sensorsArray.find(s => getParamCode(s) === "PM10");
    const pm25Sensor = sensorsArray.find(s =>
    getParamCode(s) === "PM2.5" ||
    getParamCode(s) === "PM25"
    );

    const o3Sensor  = sensorsArray.find(s => getParamCode(s) === "O3");
    const no2Sensor = sensorsArray.find(s => getParamCode(s) === "NO2");
    const so2Sensor = sensorsArray.find(s => getParamCode(s) === "SO2");

    function getSensorId(sensor) {
        return sensor?.["Identyfikator stanowiska"] ?? null;
    }

    const [pm10Data, pm25Data, o3Data, no2Data, so2Data] = await Promise.all([
        pm10Sensor ? stationDetailsApi.fetchSensorData(getSensorId(pm10Sensor)) : null,
        pm25Sensor ? stationDetailsApi.fetchSensorData(getSensorId(pm25Sensor)) : null,
        o3Sensor  ? stationDetailsApi.fetchSensorData(getSensorId(o3Sensor))  : null,
        no2Sensor ? stationDetailsApi.fetchSensorData(getSensorId(no2Sensor)) : null,
        so2Sensor ? stationDetailsApi.fetchSensorData(getSensorId(so2Sensor)) : null,
    ]);

    return {
    stationId: String(stationId),
    details: {
        pm10: pm10Data ? pickLatestValue(pm10Data) : null,
        pm25: pm25Data ? pickLatestValue(pm25Data) : null,
        o3:   o3Data  ? pickLatestValue(o3Data)  : null,
        no2:  no2Data ? pickLatestValue(no2Data) : null,
        so2:  so2Data ? pickLatestValue(so2Data) : null,
    },
    };
    } catch (errorObject) {
      return rejectWithValue({
        stationId: String(stationId),
        message: errorObject.message,
      });
    }
  }
);

const stationDetailsSlice = createSlice({
  name: "stationDetails",
  initialState: {
    byStationId: {},
    statusByStationId: {},
    errorByStationId: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchStationDetails.pending, (state, action) => {
      const id = String(action.meta.arg);
      state.statusByStationId[id] = "loading";
      state.errorByStationId[id] = null;
    });
    builder.addCase(fetchStationDetails.fulfilled, (state, action) => {
      const { stationId, details } = action.payload;
      state.byStationId[stationId] = details;
      state.statusByStationId[stationId] = "succeeded";
    });
    builder.addCase(fetchStationDetails.rejected, (state, action) => {
      const payload = action.payload;
      if (!payload?.stationId) return;
      state.statusByStationId[payload.stationId] = "failed";
      state.errorByStationId[payload.stationId] = payload.message;
    });
  },
});

export default stationDetailsSlice.reducer;
