import React from "react";
import WelcomeMessage from "./components/WelcomeMessage";
import MacroSections from "./components/MacroSections";
import GitHubHighlights from "./components/GitHubHighlights";

class Home extends React.Component {
  render() {
    return (
      <main>
        <WelcomeMessage />
        <br></br>
        <MacroSections />
        <br></br>
        <GitHubHighlights />
        <br></br>
      </main>
    );
  }
}

export default Home;