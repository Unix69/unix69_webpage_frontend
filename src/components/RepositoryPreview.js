import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Modal from "react-modal";



export default function RepoPreviewModal({ isOpen, onClose, repo }) {
  
  if (!repo) return null;

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} ariaHideApp={false}>
      <button onClick={onClose} style={{ float: "right" }}>X</button>
      <h2>{repo.name}</h2>
      <p>{repo.description}</p>
      <p>
        Owner: <strong>{repo.owner}</strong> | ⭐ {repo.stars} | 🍴 {repo.forks} | 🐛 {repo.openIssues}
      </p>
      <div style={{ maxHeight: "400px", overflowY: "scroll", border: "1px solid #ccc", padding: "10px" }}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {repo.readme || "Loading README..."}
        </ReactMarkdown>
      </div>
      <h3>Files:</h3>
      <ul>
        {repo.files?.map(file => (
          <li key={file.path}>
            <a href={file.download_url} target="_blank" rel="noopener noreferrer">{file.name}</a>
          </li>
        ))}
      </ul>
    </Modal>
  );
}