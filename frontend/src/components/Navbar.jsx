import { Link, NavLink, useNavigate } from "react-router-dom";
import { LogOut, PlusSquare, Users, House, UserRound } from "lucide-react";
import { useAuth } from "../context/AuthContext";
export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-xl font-black tracking-tight text-brand">
          Mini Media
        </Link>
        <nav className="flex items-center gap-2 text-sm [&>*:not(:nth-child(3)):hover]:bg-slate-300">
          <NavLink to="/" className="btn btn-muted ">
            <House size={16} />
            <span className="hidden sm:inline">Feed</span>
          </NavLink>
          <NavLink to="/people" className="btn btn-muted">
            <Users size={16} />
            <span className="hidden sm:inline">People</span>
          </NavLink>
          <NavLink to="/create" className="btn btn-primary ">
            <PlusSquare size={16} />
            <span className="hidden sm:inline">Create post</span>
          </NavLink>
          <NavLink to="/profile" className="btn btn-muted">
            <UserRound size={16} />
            <span className="hidden sm:inline">Profile</span>
          </NavLink>
          <button
            className="btn btn-muted"
            title="Logout"
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            <LogOut size={16} />
          </button>
        </nav>
      </div>
    </header>
  );
}
