document.addEventListener("DOMContentLoaded", () => {
    const saveButton = document.getElementById("save-group");
    const groupNameInput = document.getElementById("group-name");
    const searchBar = document.getElementById("search-bar");
    const savedGroupsList = document.getElementById("saved-groups");
  
    // save current tabs as a group
    saveButton.addEventListener("click", async () => {
      const groupName = groupNameInput.value.trim();
      if (!groupName) return alert("please enter a group name!");
  
      const tabs = await chrome.tabs.query({ currentWindow: true });
      const tabUrls = tabs.map(tab => tab.url);
  
      chrome.storage.local.set({ [groupName]: tabUrls }, () => {
        alert(`group "${groupName}" saved!`);
        displaySavedGroups();
      });
    });
  
    // display saved groups for user to select
    const displaySavedGroups = (filter = "") => {
      chrome.storage.local.get(null, (groups) => {
        savedGroupsList.innerHTML = "";
        for (const [name, urls] of Object.entries(groups)) {
          if (name.toLowerCase().includes(filter.toLowerCase())) {
            const listItem = document.createElement("li");
            listItem.textContent = name;
  
            const openButton = document.createElement("button");
            openButton.textContent = "open";
            openButton.addEventListener("click", () => {
              urls.forEach(url => chrome.tabs.create({ url }));
            });
  
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "delete";
            deleteButton.addEventListener("click", () => {
              chrome.storage.local.remove(name, displaySavedGroups);
            });
  
            listItem.appendChild(openButton);
            listItem.appendChild(deleteButton);
            savedGroupsList.appendChild(listItem);
          }
        }
      });
    };
  
    // user is able to filter groups based on search input
    searchBar.addEventListener("input", (e) => {
      const filter = e.target.value;
      displaySavedGroups(filter);
    });
  
    displaySavedGroups();
  });
  

  document.getElementById("saveGroup").addEventListener("click", () => {
    const groupName = document.getElementById("groupName").value;
    if (groupName.trim() === "") return;

    chrome.runtime.sendMessage({ action: "saveGroup", groupName }, () => {
        loadGroups();
    });
});
