import { BrowserRouter, Routes, Route } from "react-router-dom";
import './css/App.css' 
import Account from "./Account";
import Login from "./Login";
import Chats from "./Chats";

const App = () => {
  return (
    <>
       <Routes>
          <Route path="/account" element={<Account/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/" element={<Chats/>} />
      </Routes>
    </>
  )
}

export default App;