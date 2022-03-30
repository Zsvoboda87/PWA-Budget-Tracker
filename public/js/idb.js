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
    // we haven't created this yet, but we will soon, so let's comment it out for now
    // uploadPizza();
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
