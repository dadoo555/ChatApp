import { BrowserRouter, Routes, Route } from "react-router-dom";
import './css/App.css' 
import Account from "./Account";
import Login from "./Login";
import Chats from "./Chats";
import Register from "./Register";

const App = () => {
  return (
    <>
       <Routes>
          <Route path="/chat/account" element={<Account/>} />
          <Route path="/chat/login" element={<Login/>} />
          <Route path="/chat/users/create" element={<Register/>} />
          <Route path="/chat/" element={<Chats/>} />
      </Routes>
    </>
  )
}

export default App;