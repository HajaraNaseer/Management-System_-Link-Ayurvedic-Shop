import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import  Axios  from 'axios';
import Login from './Components/login';
import Dashboard from './Components/dashboard';
import AddUser from './Components/adduser';
import AddProduct from './Components/addproduct';
import ViewProduct from './Components/viewproduct';
import UpdateProduct from './Components/updateproduct';
import AddBill from './Components/addBill';
import ViewBill from './Components/viewBill';
import Logout from './Components/logout';
import ChangePassword from './Components/changePassword';
import ViewUser from './Components/viewuser';
import ExpiredProduct from './Components/viewExpired';
import FinishedProduct from './Components/viewFinished';
import Report from './Components/report';


function App() {
  Axios.defaults.withCredentials = true
  const [state, setState] = useState({
    id: "",
    name: "",
    role: ""
  })
  const [isAdmin, setIsAdmin] = useState(false)
  const [isInventory, setIsInventory] = useState(false)
  const [isCashier, setIsCashier] = useState(false)
  useEffect(() => {
    const sendData = async () => {
      try {
        const response = await Axios.get("http://localhost:3001/auth/verify");
        if (response.data.status) {
          const { id, name, role } = response.data.data;
          setState({ id, name, role });
          if (role === "ADMIN") {
            setIsAdmin(true);
          } else if (role === "INVENTORY") {
            setIsInventory(true);
          } else if (role === "CASHIER") {
            setIsCashier(true);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
    sendData();
  },[state]);
  return (
    <div>
      <Router>
        <Routes>
          {(!isAdmin || !isCashier || !isInventory) && <Route path='/signin' element={<Login />} />}
          {(isAdmin || isCashier || isInventory) && <Route path='/' element={<Dashboard />} />}
          {(isAdmin || isCashier || isInventory) && <Route path='/change' element={<ChangePassword />} />}
          {isAdmin && <Route path='/adduser' element={<AddUser />} />}
          {isAdmin && <Route path='/viewuser' element={<ViewUser />} />}
          {(isAdmin || isInventory) && <Route path='/addproduct' element={<AddProduct />} />}
          {(isAdmin || isInventory) && <Route path='/report' element={<Report />} />}
          {(isAdmin || isCashier || isInventory) && <Route path='/viewproduct' element={<ViewProduct />} />}
          {(isAdmin || isCashier || isInventory) && <Route path='/viewexpired' element={<ExpiredProduct />} />}
          {(isAdmin || isCashier || isInventory) && <Route path='/viewfinished' element={<FinishedProduct />} />}
          {(isAdmin || isInventory) && <Route path='/updateproduct/:id' element={<UpdateProduct />} />}
          {(isAdmin || isCashier) && <Route path='/addbill' element={<AddBill />} />}
          {(isAdmin || isCashier) && <Route path='/viewbill' element={<ViewBill />} />}
          {(isAdmin || isCashier || isInventory) && <Route path='/logout' element={<Logout />} />}
          {(isAdmin || isCashier || isInventory) && <Route path='*' element={<Dashboard />} />}
          {(!isAdmin || !isCashier || !isInventory) && <Route path='*' element={<Login />} />}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
