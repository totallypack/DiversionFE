import { Link, useNavigate } from "react-router-dom";
import { Navbar, NavbarBrand, Nav, NavItem, NavLink, Button } from "reactstrap";

export default function NavBar() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    window.location.reload();
  };

  return (
    <Navbar color="dark" dark expand="md" className="mb-4" sticky="top">
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
          <NavLink tag={Link} to="/my-profile">
            My Profile
          </NavLink>
        </NavItem>
        <NavItem className="d-flex align-items-center ms-2">
          <span className="text-light me-3">Hi, {username}!</span>
          <Button color="outline-light" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </NavItem>
      </Nav>
    </Navbar>
  );
}
