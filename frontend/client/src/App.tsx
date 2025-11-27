import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ClientList from "./pages/Clients/ClientList";
import ClientForm from "./pages/Clients/ClientForm";
import ServiceList from "./pages/Services/ServiceList";
import ServiceForm from "./pages/Services/ServiceForm";
import BookingList from "./pages/Bookings/BookingList";
import BookingForm from "./pages/Bookings/BookingForm";

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/dashboard">
        {() => (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/clients" component={() => <ProtectedRoute><ClientList /></ProtectedRoute>} />
      <Route path="/clients/:id" component={() => <ProtectedRoute><ClientForm /></ProtectedRoute>} />
      <Route path="/services" component={() => <ProtectedRoute><ServiceList /></ProtectedRoute>} />
      <Route path="/services/:id" component={() => <ProtectedRoute><ServiceForm /></ProtectedRoute>} />
      <Route path="/bookings" component={() => <ProtectedRoute><BookingList /></ProtectedRoute>} />
      <Route path="/bookings/:id" component={() => <ProtectedRoute><BookingForm /></ProtectedRoute>} />
      <Route path="/" component={() => <Login />} />
      <Route path="/404" component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
