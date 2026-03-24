import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import Calendario from "./pages/Calendario";
import Inventario from "./pages/Inventario";
import Ventas from "./pages/Ventas";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login/>} />

        <Route element={<Layout/>}>

          <Route path="/calendario" element={<Calendario/>}/>
          <Route path="/inventario" element={<Inventario/>}/>
          <Route path="/ventas" element={<Ventas/>}/>

        </Route>

      </Routes>

    </BrowserRouter>
  );
}

export default App;
