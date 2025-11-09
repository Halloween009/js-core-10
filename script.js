document.body.style.cssText =
  "margin: 0; padding: 0; display: flex; justtify-content: space-between; align-items: center;";

const menuContainer = document.createElement("div");
menuContainer.style.cssText = `max-width: 661px; margin: 50px auto; padding: 62px; background-color: #C4C4C4; box-sizing: border-box;`;

const inputMenu = document.createElement("input");
inputMenu.style.cssText = `display: block; width: 500px; height: 61px; border: 0px; font-size: 48px;`;

const autoComplete = document.createElement("div");
autoComplete.style.cssText = `
position: absolute;
background: #E3E3E3;
border: 1px solid black;
width: 500px;
display: none;
z-index: 100;`;

function autoCompleteList(repos) {
  autoComplete.innerHTML = "";

  if (repos.length === 0) {
    autoComplete.style.display = "none";
    return;
  }

  repos.forEach((repo) => {
    const item = document.createElement("div");
    item.textContent = repo.name;
    item.style.cssText = `
    border: 2px solid black;
    font-size: 30px;
    font-weight: 400;
    cursor: pointer;
    padding: 10px;
        `;
    item.addEventListener("click", () => {
      addRepoToList(repo);
      inputMenu.value = "";
      autoComplete.innerHTML = "";
      autoComplete.style.display = "none";
    });
    autoComplete.appendChild(item);
  });

  autoComplete.style.display = "block";
}
async function searchRepositories(search) {
  if (!search) {
    return;
  }
  try {
    const response = await fetch(
      `https://api.github.com/search/repositories?q=${search}&per_page=5`
    );
    const data = await response.json();
    autoCompleteList(data.items || []);
  } catch (error) {
    console.log(error);
  }
}
inputMenu.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchRepositories(e.target.value);
  }
});

inputMenu.addEventListener("blur", () => {
  setTimeout(() => {
    autoComplete.style.display = "none";
  }, 200);
});

inputMenu.addEventListener("focus", () => {
  if (autoComplete.children.length > 0) {
    autoComplete.style.display = "block";
  }
});

const repoList = document.createElement("div");
repoList.style.cssText = `
width: 100%;
margin-top: 300px;`;

function addRepoToList(repo) {
  const listItem = document.createElement("div");
  listItem.style.cssText = `
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #E27BEB;
  width: 500px;
  height: 100px;
  border: 1px solid black;
  padding: 0 10px 0 10px`;
  const repoInfo = document.createElement("div");
  repoInfo.innerHTML = `
  <div>Name: ${repo.name}</div>
  <div>Owner: ${repo.owner.login}</div>
  <div>Stars: ${repo.stargazers_count}</div>
  `;

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.style.cssText = `
  color: red;
  font-weight: 400;
  font-size: 40px;
  background: none;
  border: none;
  cursor: pointer;`;
  deleteButton.addEventListener("click", () => {
    listItem.remove();
  });
  listItem.appendChild(repoInfo);
  listItem.appendChild(deleteButton);
  repoList.appendChild(listItem);
}
menuContainer.appendChild(inputMenu);
menuContainer.appendChild(autoComplete);
menuContainer.appendChild(repoList);
document.body.appendChild(menuContainer);
