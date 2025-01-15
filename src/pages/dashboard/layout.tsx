const AboutLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="about-layout">
      <nav>Dashboard layout</nav>
      <main>{children}</main>
    </div>
  );
};

export default AboutLayout;
