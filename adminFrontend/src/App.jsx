import { BrowserRouter,Routes,Route } from "react-router-dom";
import AdminHomePage from "./pages/homePage";
import { Registration } from "./pages/register";
import { SignIn } from "./pages/signin";
import AdminDashBoard from "./pages/adminDashboard";
import CreateTicketComponent from "./components/CreateTicket";
import Card from "./components/Card";
import CommentComponent from "./components/commentComponent";

const App = () => {
  return (
   <BrowserRouter>
    <Routes>
      <Route path="/" element={<AdminHomePage />}/>
      <Route path="/admin/register" element={<Registration/>}/>
      <Route path="/admin/signin" element={<SignIn/>}/>
      <Route path="/admin/dashboard" element={<AdminDashBoard/>}/>
      <Route path="/hello" element={<CreateTicketComponent/>}/>
      <Route path="/card" element={<Card/>}/>
      <Route path="/comment" element={<CommentComponent/>}/>
    </Routes>
   </BrowserRouter>
  )
}

export default App