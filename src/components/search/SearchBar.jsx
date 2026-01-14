import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input, InputGroup } from "reactstrap";
import "./SearchBar.css";

export default function SearchBar() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="search-bar-form">
      <InputGroup className="search-bar-input-group">
        <Input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-bar-input"
        />
        <button type="submit" className="search-bar-button">
          🔍
        </button>
      </InputGroup>
    </form>
  );
}
