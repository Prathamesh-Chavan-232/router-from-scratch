import { Link } from "react-router";

const AboutLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="about-layout">
      <nav>Root level Navigation</nav>
      <main>{children}</main>
      <Link to="/home">Home page</Link>
      <Link to="/">Root page</Link>
      <Link to="/about">About page</Link>
      <Link to="/dashboard">Dash page</Link>
    </div>
  );
};

export default AboutLayout;
