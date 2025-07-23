import { BrowserRouter,Routes,Route } from "react-router-dom";
import AdminHomePage from "./pages/homePage";
import { Registration } from "./pages/register";
import { SignIn } from "./pages/signin";
import AdminDashBoard from "./pages/adminDashboard";
import UserTickets from "./components/UserTickets";


const App = () => {
  return (
   <BrowserRouter>
    <Routes>
      <Route path="/" element={<AdminHomePage />}/>
      <Route path="/admin/register" element={<Registration/>}/>
      <Route path="/admin/signin" element={<SignIn/>}/>
      <Route path="/admin/dashboard" element={<AdminDashBoard/>}/>
         <Route path="/admin/user-tickets/:id/:name" element={<UserTickets />} />

    </Routes>
   </BrowserRouter>
  )
}

export default App