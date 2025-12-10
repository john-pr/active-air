import './App.css'
import { Routes, Route, Navigate } from "react-router";
import MapPage from "@pages/MapPage";

function App() {

  return (
    <Routes>
      <Route 
        path="/" 
        element={<MapPage />}
      >
       <Route index element={null} />
       <Route 
        path="station/:stationId"
        element={null}
       />
      </Route>
     
      <Route 
        path="*" 
        element={<Navigate to="/" replace />}
      />
    </Routes>
  )
}

export default App
