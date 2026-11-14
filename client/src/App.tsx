import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import TopicPage from "./pages/TopicPage";
import ExamPapers from "./pages/ExamPapers";
import FormulaLibrary from "./pages/FormulaLibrary";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/topic/:id" component={TopicPage} />
      <Route path="/papers" component={ExamPapers} />
      <Route path="/formula-library" component={FormulaLibrary} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark" switchable>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
