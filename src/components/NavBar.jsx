import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getMyProfile } from "../managers/profileManager";
import { getReceivedRequests } from "../managers/friendManager";
import { getUnreadMessageCount } from "../managers/messageManager";
import NotificationBell from "./common/NotificationBell";
import SearchBar from "./search/SearchBar";
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Badge
} from "reactstrap";
import "./NavBar.css";

export default function NavBar() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [navbarOpacity, setNavbarOpacity] = useState(1);
  const [profile, setProfile] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);

  const toggle = () => setDropdownOpen(prevState => !prevState);

  useEffect(() => {
    loadProfile();
    loadPendingRequests();
    loadUnreadMessages();

    // Poll for new requests and messages every 30 seconds
    const interval = setInterval(() => {
      loadPendingRequests();
      loadUnreadMessages();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadProfile = async () => {
    try {
      const profileData = await getMyProfile();
      setProfile(profileData);
    } catch (err) {
      console.error("Failed to load profile:", err);
    }
  };

  const loadPendingRequests = async () => {
    try {
      const requests = await getReceivedRequests();
      setPendingRequestsCount(requests.length);
    } catch (err) {
      console.error("Failed to load pending requests:", err);
    }
  };

  const loadUnreadMessages = async () => {
    try {
      const count = await getUnreadMessageCount();
      setUnreadMessageCount(count);
    } catch (err) {
      console.error("Failed to load unread messages:", err);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const maxScroll = 500;

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
      style={{ backgroundColor: `rgba(var(--color-light-grey-rgb), ${navbarOpacity})` }}
    >
      <NavbarBrand tag={Link} to="/dashboard">
        Diversion
      </NavbarBrand>
      <SearchBar />
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
          <NavLink tag={Link} to="/friends" style={{ position: "relative" }}>
            Friends
            {pendingRequestsCount > 0 && (
              <Badge
                color="danger"
                pill
                style={{
                  position: "absolute",
                  top: "8px",
                  right: "-8px",
                  fontSize: "0.7rem",
                  minWidth: "18px",
                  height: "18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                {pendingRequestsCount}
              </Badge>
            )}
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink tag={Link} to="/messages" style={{ position: "relative" }}>
            Messages
            {unreadMessageCount > 0 && (
              <Badge
                color="danger"
                pill
                style={{
                  position: "absolute",
                  top: "8px",
                  right: "-8px",
                  fontSize: "0.7rem",
                  minWidth: "18px",
                  height: "18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                {unreadMessageCount}
              </Badge>
            )}
          </NavLink>
        </NavItem>
        <NotificationBell />
        <NavItem>
          <NavLink tag={Link} to="/communities">
            Communities
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
            <span className="dropdown-text-wrapper" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {profile?.profilePicUrl && !imageError ? (
                <img
                  src={profile.profilePicUrl}
                  alt={profile.displayName || username}
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                  onError={() => setImageError(true)}
                />
              ) : (
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    backgroundColor: "var(--color-gold)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--color-black)",
                    fontWeight: "bold",
                    fontSize: "14px",
                  }}
                >
                  {(profile?.displayName || username)?.charAt(0).toUpperCase()}
                </div>
              )}
              <span>{profile?.displayName || username}</span>
              <span className="arrow-custom"></span>
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
            <DropdownItem tag={Link} to="/settings/blocked-users">
              Blocked Users
            </DropdownItem>
            {profile?.isAdmin && (
              <>
                <DropdownItem divider />
                <DropdownItem tag={Link} to="/admin">
                  Admin Dashboard
                </DropdownItem>
              </>
            )}
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
