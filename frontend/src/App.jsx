import { BrowserRouter,Routes,Route } from "react-router-dom";
import HomePage from "./pages/homePage";
import { Registration } from "./pages/register";
import { SignIn } from "./pages/signin";
import UserDashBoard from "./pages/userDashBoard";

const App = () => {
  return (
   <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomePage/>}/>
      <Route path="/register" element={<Registration/>}/>
      <Route path="/signin" element={<SignIn/>}/>
      <Route path="/dashboard" element={<UserDashBoard/>}/>
    </Routes>
   </BrowserRouter>
  )
}

export default App