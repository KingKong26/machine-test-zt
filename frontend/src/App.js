import "./App.css";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext.jsx";

function App() {
  const { user } = useContext(AuthContext);
  return (
    <BrowserRouter>
      <div className="App">
        <Switch>
          <Route path="/" exact>
            {user ? <Redirect to="/app" /> : <Landing />}
          </Route>
          <Route path="/app">{user ? <Home /> : <Redirect to="/" />}</Route>
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
