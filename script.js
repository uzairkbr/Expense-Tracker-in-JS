const expenseModal = document.querySelector("#add-expense-modal"); // expense modal
const modalCloseBtn = document.querySelector(".close-btn"); // expense modal close button
const addExpense = document.querySelector("#add-expense-btn"); // add expense button (main UI)
const newPersonBtn = document.querySelector("#add-person-btn") // add new person button (main UI)
const newPersonModal  = document.querySelector("#add-person-modal"); // new person modal
const detailsContainer = document.querySelector(".details-container"); // list to add the expenses.
const addExpenseSubmitBtn = document.querySelector(".add-Expense-Btn"); 
const historyCloseBtn = document.querySelector(".transaction-close-btn"); 
const overviewCards = document.querySelector(".overview-cards");



// Transaction details modal
const transactionDetailsModal = document.querySelector("#transaction-details-modal");
const transactionCloseBtn = document.querySelector(".transaction-close-btn");


const personAccounts = [
    { name: "Uzair", amount: 0 },
    { name: "Shaheer", amount: 0 },
];

const transactions = [];


historyCloseBtn.addEventListener("click", function(e) {
    transactionDetailsModal.classList.add("display-none");
})

// show modal to add expense
addExpense.addEventListener("click", function() {
    expenseModal.classList.remove("display-none");
    
    // load the persons on UI for selection of payer
    const selectSection = document.querySelector(".select-payer");

    selectSection.innerHTML = "";
    for (let i = 0; i < personAccounts.length; i++) {
        const option = document.createElement("option");
        option.value = personAccounts[i].name;
        option.innerText = personAccounts[i].name;
        console.log(option);

        selectSection.appendChild(option);
    }


    const mutlipleSelectSection = document.querySelector("#persons-multiple-select");
    mutlipleSelectSection.innerHTML = "";
    for (let i = 0; i < personAccounts.length; i++) {
        const option = document.createElement("option");
        option.value = personAccounts[i].name;
        option.innerText = personAccounts[i].name;
        console.log(option);

        mutlipleSelectSection.appendChild(option);
    }

})

// close expense modal 
modalCloseBtn.addEventListener("click", function() {
    expenseModal.classList.add("display-none");

})

// show the new person modal
newPersonBtn.addEventListener("click", function() {
    newPersonModal.classList.remove("display-none");
})

// add new person ( submit ) button clicked
document.querySelector(".add-Person-Btn").addEventListener("click", function(e) {
    e.preventDefault();

    const personName = document.querySelector("#person-name").value;


    const div = document.createElement("div");
    div.classList.add("card");
    const h3  = document.createElement("h3");
    h3.classList.add("person-account-name");
    h3.innerText = personName;
    const p = document.createElement("p");
    p.classList.add("person-account-amount");
    p.innerText = "0";

    // append h3 and p into div (card)
    div.appendChild(h3);
    div.appendChild(p);

    // append div into the overviewCards sections
    overviewCards.appendChild(div);

    personAccounts.push({name:`${personName}`, amount: 0});

    newPersonModal.classList.add("display-none");
    clearUpInputs();
})


// close the new person modal
document.querySelector(".new-person-close-btn").addEventListener("click", function() {
    newPersonModal.classList.add("display-none");
})


// enter expense
addExpenseSubmitBtn.addEventListener("click", function(e) {
    e.preventDefault();

    const amount = document.querySelector("#amount").value;
    const numPeople = document.querySelector("#num-people").value;
    const payer = document.querySelector("#payer").value;
    const description = document.querySelector("#description-input").value;

    const personsInExpense = document.querySelector("#persons-in-expenses").value; // get string from it.

    // Split the string into an array and log the result and its type
    const personsArray = personsInExpense.split(",").map(item => item.trim());

     // Get current date and time
    const now = new Date();
    const date = now.toLocaleDateString();
    const time = now.toLocaleTimeString();
    const day = now.toLocaleDateString('en-US', { weekday: 'long' });

    const transaction = {
        date,
        time,
        day,
        payer,
        description,
        persons: personsArray.join(", ")
    };

    transactions.push(transaction);

    const li = document.createElement("li");
    li.style.cursor = "pointer";
    li.addEventListener("click", function() {
        showTransactionDetails(transaction);
    });
    
    const p1 = document.createElement("p");
    let textNode = document.createTextNode(description);
    p1.classList.add("description-container");
    p1.appendChild(textNode);
    li.appendChild(p1);

    let p2 = document.createElement("p");
    const perPerson = amount / numPeople;
    textNode = document.createTextNode(perPerson);
    p2.appendChild(textNode);
    p2.innerText += " / Person";
    p2.classList.add("amount-per-person");
    li.appendChild(p2);

    let p3 = document.createElement("p");
    p3.innerText = "Paid by: " + payer;
    p3.classList.add("payer");
    li.appendChild(p3);

    detailsContainer.appendChild(li);
    expenseModal.classList.add("display-none");


    // calculations
    let payerGetMoney = false;
    personsArray.forEach(person => {
        personAccounts.forEach(p => {
            if (payer.toLowerCase() === p.name.toLowerCase() && !payerGetMoney) {
                p.amount += (amount - perPerson); 
                payerGetMoney = !payerGetMoney; 
            }
            if (p.name.toLowerCase() === person.toLowerCase() && payer.toLowerCase() !== person.toLowerCase()) {
                p.amount -= perPerson;
            }
        });
    });
        
    clearUpInputs();
    renderUsers(personAccounts);
})


const clearUpInputs = () => {
    document.querySelector("#amount").value = "";
    document.querySelector("#num-people").value = "";
    document.querySelector("#payer").value = "";
    document.querySelector("#description-input").value = "";
    document.querySelector("#persons-in-expenses").value = "";


    document.querySelector("#person-name").value = "";
}

const renderUsers = (arrayOfPersons) => {

    overviewCards.innerHTML = "";

    arrayOfPersons.forEach(person => {
        const div = document.createElement("div");
        div.classList.add("card");

        const h3 = document.createElement("h3");
        h3.classList.add("person-account-name");
        h3.innerText = person.name;

        const p = document.createElement("p");
        p.classList.add("person-account-amount");
        p.innerText = person.amount;

        p.style.color = person.amount > 1 ? "green" : person.amount < 0 ? "red" : "black";

        div.appendChild(h3);
        div.appendChild(p);
        overviewCards.appendChild(div);


    })
}

renderUsers(personAccounts);


// Function to show transaction details
const showTransactionDetails = (transaction) => {
    document.querySelector("#transaction-date").innerText = `Date: ${transaction.date}`;
    document.querySelector("#transaction-time").innerText = `Time: ${transaction.time}`;
    document.querySelector("#transaction-day").innerText = `Day: ${transaction.day}`;
    document.querySelector("#transaction-payer").innerText = `Payer: ${transaction.payer}`;
    document.querySelector("#transaction-description").innerText = `Description: ${transaction.description}`;
    document.querySelector("#transaction-persons").innerText = `Persons in Expense: ${transaction.persons}`;

    transactionDetailsModal.classList.remove("display-none");
};

// Close the transaction details modal
transactionCloseBtn.addEventListener("click", function() {
    transactionDetailsModal.classList.add("display-none");
});


