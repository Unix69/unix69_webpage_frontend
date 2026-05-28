const RepositoryUrls = {
  README_MASTER: (fullName) => `https://raw.githubusercontent.com/${fullName}/master/README.md`,
  README_MAIN: (fullName) => `https://raw.githubusercontent.com/${fullName}/main/README.md`,
};

export default RepositoryUrls;