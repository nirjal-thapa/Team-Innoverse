function App() {
  const studioName = "Innoverse Studio";
  const [currentPage, setCurrentPage] = React.useState("home");

  function handleLogout() {
    alert("Logout button clicked");
  }

  function showCurrentPage() {
    if (currentPage === "packages") {
      return <PackagesPage />;
    }

    if (currentPage === "home") {
      return <HomePage title={`Welcome back, ${studioName}`} />;
    }

    if (currentPage === "finder") {
      return <HomePage title="AI Photo Finder" />;
    }

    if (currentPage === "contact") {
      return <HomePage title="Contact Us" />;
    }

    if (currentPage === "about") {
      return <HomePage title="About Us" />;
    }

    return <HomePage title={`Welcome back, ${studioName}`} />;
  }

  return (
    <>
      <Navbar
        currentPage={currentPage}
        studioName={studioName}
        onChangePage={setCurrentPage}
        onLogout={handleLogout}
      />
      {showCurrentPage()}
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
