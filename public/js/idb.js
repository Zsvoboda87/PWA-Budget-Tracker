// create variable to hold db connection
let db;
const request = indexedDB.open("budget_tracker", 1);

request.onupgradeneeded = function (event) {
  const db = event.target.result;
  db.createObjectStore("new_budget_item", { autoIncrement: true });
};

// upon a successful
request.onsuccess = function (event) {
  db = event.target.result;

  if (navigator.onLine) {
    uploadBudgetItems();
  }
};

request.onerror = function (event) {
  // log error here
  console.log(event.target.errorCode);
};


function saveRecord(record) {
  const transaction = db.transaction(["new_budget_item"], "readwrite");
  const budgetObjectStore = transaction.objectStore("new_budget_item");

  budgetObjectStore.add(record);
}

function uploadBudgetItems() {
  
  const transaction = db.transaction(["new_budget_item"], "readwrite");
  const budgetObjectStore = transaction.objectStore("new_budget_item");
  const getAll = budgetObjectStore.getAll();

  getAll.onsuccess = function () {
    // if there was data in indexedDb's store, let's send it to the api server
    if (getAll.result.length > 0) {
      fetch("/api/transaction", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((serverResponse) => {
          if (serverResponse.message) {
            throw new Error(serverResponse);
          }
          
          const transaction = db.transaction(["new_budget_item"], "readwrite");
          const budgetObjectStore = transaction.objectStore("new_budget_item");
          budgetObjectStore.clear();

          alert("Saved budget items has been submitted!");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
}


window.addEventListener("online", uploadBudgetItems);
