// profile info div
const overview = document.querySelector(".overview");
// github username
const username = "jgordon85";
// repo list
const repoList = document.querySelector(".repo-list");
// repo info section
const repoInfoSection = document.querySelector(".repos");
// individual repo data
const indRepoData = document.querySelector(".repo-data");
// back to gallery button
const backToGallery = document.querySelector(".view-repos");
// dynamic search
const filterInput = document.querySelector(".filter-repos");

const getGithub = async function () {
  const userInfo = await fetch(`https://api.github.com/users/${username}`);
  const data = await userInfo.json();
  displayUserInfo(data);
};

getGithub();

const displayUserInfo = function (data) {
  const div = document.createElement("div");
  div.classList.add("user-info");
  div.innerHTML = `
    <figure>
      <img alt="user avatar" src=${data.avatar_url} />
    </figure>
    <div>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Bio:</strong> ${data.bio}</p>
      <p><strong>Location:</strong> ${data.location}</p>
      <p><strong>Number of public repos:</strong> ${data.public_repos}</p>
    </div>`;
    overview.append(div);
    getRepoList();
};

const getRepoList = async function () {
  const repoInfo = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
  const repoData = await repoInfo.json();
  displayRepos(repoData);
};

const displayRepos = function (repos) {
  filterInput.classList.remove("hide");
  for (const repo of repos) {
    const repoItem = document.createElement("li");
    repoItem.classList.add("repo");
    repoItem.innerHTML = `<h3>${repo.name}</h3>`;
    repoList.append(repoItem);
  }
};

repoList.addEventListener("click", function (e) {
  if (e.target.matches("h3")) {
    const repoName = e.target.innerText;
  getRepoName(repoName);
  }
});

const getRepoName = async function (repoName) {
  const fetchInfo = await fetch(`https://api.github.com/repos/${username}/${repoName}`);
  const repoInfo = await fetchInfo.json();
  console.log(repoInfo);

  const fetchLanguages = await fetch(repoInfo.languages_url);
    const languageData = await fetchLanguages.json();
  // console.log(languageData);

  const languages = [];
  for (const language in languageData) {
  // console.log(language);
    languages.push(language);
  }
  displayRepoInfo(repoInfo, languages);
};

const displayRepoInfo = function (repoInfo, languages) {
  indRepoData.innerHTML = "";
  indRepoData.classList.remove("hide");
  repoInfoSection.classList.add("hide");
  backToGallery.classList.remove("hide");
  const div = document.createElement("div");
  div.innerHTML = `
  <h3>Name: ${repoInfo.name}</h3>
    <p>Description: ${repoInfo.description}</p>
    <p>Default Branch: ${repoInfo.default_branch}</p>
    <p>Languages: ${languages.join(", ")}</p>
    <a class="visit" href="${repoInfo.html_url}" target="_blank" rel="noreferrer noopener">View Repo on GitHub!</a>
  `;
  indRepoData.append(div);
};

backToGallery.addEventListener("click", function () {
  repoInfoSection.classList.remove("hide");
  indRepoData.classList.add("hide");
  backToGallery.classList.add("hide");
});

filterInput.addEventListener("input", function (e) {
  const searchText = e.target.value;
  const repos = document.querySelectorAll(".repo");
  const searchLowercase = searchText.toLowerCase();

  for (const repo of repos) {
    const lowerCaseText = repo.innerText.toLowerCase();
    if (lowerCaseText.includes(searchLowercase)) {
      repo.classList.remove("hide");
    } else {
      repo.classList.add("hide");
    }
  }
});
