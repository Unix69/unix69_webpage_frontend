// src/components/RepositoryErrors.js
export class FetchError extends Error {
  constructor(resource, status, message) {
    super(message || `Failed to fetch ${resource}, status ${status}`);
    this.name = "FetchError";
    this.resource = resource;
    this.status = status;
  }
}