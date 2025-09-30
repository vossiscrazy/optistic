function App() {
  return (
    <>
      <header>
        <h1>Optistic</h1>
      </header>

      <div className="grid-container">
      <div className="list inbox">
        <h3>Inbox</h3>
        <p>Review AI safety research</p>
        <p>Update autonomous systems protocol</p>
        <p>Schedule team sync on acceleration metrics</p>
      </div>

      <div className="list trash">
        <h3>Trash</h3>
        <p>Old meeting notes</p>
        <p>Deprecated feature specs</p>
      </div>

      <div className="list watch">
        <h3>Watch</h3>
        <p>Monitor compute cluster performance</p>
        <p>Track competitor model releases</p>
        <p>Review quarterly progress metrics</p>
      </div>

      <div className="list todo">
        <h3>Todo</h3>
        <p>Ship v2 model improvements</p>
        <p>Optimize inference pipeline</p>
        <p>Write technical documentation</p>
        <p>Review pull requests</p>
      </div>

      <div className="list later">
        <h3>Later</h3>
        <p>Research new architecture patterns</p>
        <p>Plan Q3 roadmap</p>
        <p>Explore multi-modal capabilities</p>
      </div>

      <div className="list anti-todo">
        <h3>Anti-Todo</h3>
        <p>Launched production deployment</p>
        <p>Completed security audit</p>
        <p>Fixed critical performance bug</p>
        <p>Merged feature branch</p>
      </div>

      <div className="list next-day">
        <h3>Next Day</h3>
        <p>Start benchmark evaluation</p>
        <p>Begin infrastructure migration</p>
        <p>Draft proposal for new initiative</p>
      </div>
      </div>

      <footer>
        <p>© 2025 Optistic</p>
      </footer>
    </>
  )
}

export default App
