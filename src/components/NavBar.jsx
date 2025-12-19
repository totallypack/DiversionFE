import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";
import "./NavBar.css";

export default function NavBar() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [navbarOpacity, setNavbarOpacity] = useState(1);

  const toggle = () => setDropdownOpen(prevState => !prevState);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const maxScroll = 500; // Scroll distance to reach full transparency

      // Calculate opacity: 1 at top, 0 at maxScroll
      const opacity = Math.max(0, 1 - (scrollPosition / maxScroll));
      setNavbarOpacity(opacity);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    window.location.reload();
  };

  return (
    <Navbar
      expand="md"
      className="navbar-custom"
      sticky="top"
      style={{ backgroundColor: `rgba(var(--color-purple-rgb), ${navbarOpacity})` }}
    >
      <NavbarBrand tag={Link} to="/dashboard">
        Diversion
      </NavbarBrand>
      <Nav className="ms-auto" navbar>
        <NavItem>
          <NavLink tag={Link} to="/dashboard">
            Home
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink tag={Link} to="/browse-interests">
            Browse Interests
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink tag={Link} to="/friends">
            Friends
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink tag={Link} to="/events/create">
            Create Event
          </NavLink>
        </NavItem>
        <Dropdown nav isOpen={dropdownOpen} toggle={toggle}>
          <DropdownToggle
            nav
            className="dropdown-btn-toggle"
            aria-expanded={dropdownOpen}
            aria-label="User menu"
            role="menuitem"
          >
            <span className="dropdown-text-wrapper">
              Hi, {username}!
              <span className="caret-custom"></span>
            </span>
            <span className="underline-effect"></span>
          </DropdownToggle>
          <DropdownMenu end>
            <DropdownItem tag={Link} to="/my-profile">
              My Profile
            </DropdownItem>
            <DropdownItem tag={Link} to="/select-interests">
              My Interests
            </DropdownItem>
            <DropdownItem divider />
            <DropdownItem onClick={handleLogout}>
              Logout
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </Nav>
    </Navbar>
  );
}
