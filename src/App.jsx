  import { Routes, Route } from "react-router-dom";
  import "./App.css";

  function App() {
    return (
      <div className="App">
        <h1>Welcome to Diversion!</h1>
        <Routes>
          <Route path="/" element={<h2>Home Page</h2>} />
        </Routes>
      </div>
    );
  }

  export default App;
