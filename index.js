const DATA_KEY = "campaigns";
let campaigns = [];

function saveData() {
  const dataToSave = campaigns.map((singleCampaign) => {
    return Object.assign({}, singleCampaign, { isInEdit: false });
  });

  window.localStorage.setItem(DATA_KEY, JSON.stringify(dataToSave));
};

document.querySelector("#addCampaign").addEventListener("click", () => {
  const campaignForm = document.querySelector("#campaign-form");
  if (campaignForm.style.display === "block") {
    campaignForm.style.display = "none";
  } else {
    campaignForm.style.display = "block";
  }
});

function draw() {
  const ulId = "campaign-list";
  const selectedList = document.querySelector(`#${ulId}`)
  const app = document.querySelector("#app");
  const list = selectedList || document.createElement("ul");
  
  if(selectedList) {
    list.innerHTML = null;
  } else {
    list.id = ulId;
    app.append(list);
  }

  campaigns.filter((singleCampaign) => {
    const searchQuery = document.querySelector("#campaign-search").value.toLowerCase();
    const campaignValue = Object.values(singleCampaign).reduce((result, value) => {
      if (typeof value === "string") {
        result.push(value.toLowerCase());
      }
      return result;
    }, []);

    return campaignValue.some((value) => value.includes(searchQuery));
  }).forEach((singleCampaign, index) => {
    const listItem = document.createElement("li");
    const nameEl = document.createElement(singleCampaign.isInEdit ? "input" : "span");
    const statusEl = document.createElement(singleCampaign.isInEdit ? "input" : "span");
    const imgButton = document.createElement("button");
    const dateEl = document.createElement(singleCampaign.isInEdit ? "input" : "span");
    const countryEl = document.createElement(singleCampaign.isInEdit ? "input" : "span");
    const deleteButton = document.createElement("button");
    const editButton = document.createElement("button");

    if (singleCampaign.isInEdit) {
      nameEl.value = singleCampaign.name;
      statusEl.value = singleCampaign.status;
      dateEl.value = singleCampaign.date;
      countryEl.value = singleCampaign.country;
    } else {
      nameEl.textContent = singleCampaign.name;
      statusEl.textContent = singleCampaign.status;
      dateEl.textContent = singleCampaign.date;
      countryEl.textContent = singleCampaign.country;
    }
   
    imgButton.type = "button";
    imgButton.textContent = "img";
    deleteButton.type = "button";
    deleteButton.textContent = "delete";
    editButton.type = "button";
    editButton.textContent = singleCampaign.isInEdit ? "✔" : "✏️"


    imgButton.addEventListener("click", () => {
      window.open(singleCampaign.image);
    });

    editButton.addEventListener("click", () => {
      if (singleCampaign.isInEdit) {
        campaigns[index].name = nameEl.value;
        campaigns[index].status = statusEl.value;
        campaigns[index].dateEl = dateEl.value;
        campaigns[index].countryEl = countryEl.value;
      }

      campaigns[index].isInEdit = !campaigns[index].isInEdit;

      saveData();
      draw();
    });

    deleteButton.addEventListener("click", () => {
      campaigns.splice(index, 1);

      saveData();
      draw();
    });

    listItem.append(nameEl, statusEl, imgButton, dateEl, countryEl, deleteButton, editButton);
    list.append(listItem);
  });
};


document.querySelector("#campaign-form").addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.querySelector("#campaign-form #campaign-name").value;
  const region = document.querySelector("#campaign-form #campaign-region").value;
  const country = document.querySelector("#campaign-form #campaign-country").value
  const status = document.querySelector("#campaign-form #campaign-status").value;
  const image = document.querySelector("#campaign-form #campaign-image").value;
  const date = document.querySelector("#campaign-form #campaign-start").value;

  campaigns.push({ 
    name: name, 
    region: region, 
    country: country, 
    status: status, 
    image: image, 
    date: date, 
    isInEdit: false 
  });

  saveData();
  draw();
});

document.querySelector("#campaign-search").addEventListener("input", draw);

window.addEventListener("DOMContentLoaded", () => {
  const persistedData = window.localStorage.getItem(DATA_KEY);

  if (persistedData) {
    campaigns = JSON.parse(persistedData);
    draw();
  } 
});





