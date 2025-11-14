import { Router, Route } from "@solidjs/router";
import { AuthProvider } from "./contexts/AuthContext";
import { FlashProvider } from "./contexts/FlashContext";
import Nav from "./components/common/Nav";
import Flash from "./components/common/Flash";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Logout from "./pages/Logout";
import Profile from "./pages/Profile";
import Delete from "./pages/Delete";
import Booking from "./pages/Booking";
import Forgot from "./pages/Forgot";
import Reset from "./pages/Reset";
import NotFound from "./pages/NotFound";
import "./App.css";

const App = () => {
  return (
    <Router
      root={(props) => (
        <FlashProvider>
          <AuthProvider>
            <Nav />
            <Flash />
            <div class="main-content">{props.children}</div>
          </AuthProvider>
        </FlashProvider>
      )}
    >
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/logout" component={Logout} />
      <Route path="/profile" component={Profile} />
      <Route path="/delete" component={Delete} />
      <Route path="/bookings" component={Booking} />
      <Route path="/book" component={Booking} />
      <Route path="/forgot" component={Forgot} />
      <Route path="/reset-password" component={Reset} />
      <Route path="*" component={NotFound} />
    </Router>
  );
};

export default App;
