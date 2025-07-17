import { BrowserRouter,Routes,Route } from "react-router-dom";
import HomePage from "./pages/homePage";
import { Registration } from "./pages/register";
import { SignIn } from "./pages/signin";
import UserDashBoard from "./pages/userDashBoard";
import CreateTicketComponent from "./components/CreateTicket";

const App = () => {
  return (
   <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomePage/>}/>
      <Route path="/user/register" element={<Registration/>}/>
      <Route path="/user/signin" element={<SignIn/>}/>
      <Route path="/user/dashboard" element={<UserDashBoard/>}/>
      <Route path="/hello" element={<CreateTicketComponent/>}/>
    </Routes>
   </BrowserRouter>
  )
}

export default App