
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import CreateGroup from "./pages/CreateGroup";
import Groups from "./pages/Groups";
import GroupDetails from "./pages/GroupDetails";
import AddExpense from "./pages/AddExpense";
import Settlement from "./pages/Settlement";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />

          <Route
            path="/create-group"
            element={<CreateGroup />}
          />

          <Route
            path="/groups"
            element={<Groups />}
          />

          <Route
            path="/group-details/:groupId"
            element={<GroupDetails />}
          />

          <Route
            path="/add-expense/:groupId"
            element={<AddExpense />}
          />

          <Route
            path="/settlement/:groupId"
            element={<Settlement />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

