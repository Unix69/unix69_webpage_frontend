import React from "react";
import "./WelcomeMessage.css";

class WelcomeMessage extends React.Component {
  render() {
    return (
      <div className="welcome-chat-wrapper">
        <div className="welcome-chat-card">
          <div className="welcome-chat-body">
            <div style={{fontSize:"45px", fontWeight:"bold"}}>
              Code Snippets · Guides · Tutorials · Repositories · Experiments
            </div>
            <div style={{fontSize:"14px", marginTop:"8px"}}>
              Designed to help both beginners and experienced developers explore,
              learn, and contribute to the shared knowledge base.
            </div>

          </div>
        </div>
      </div>
    );
  }
}

export default WelcomeMessage;