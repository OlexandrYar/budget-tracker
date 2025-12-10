let savedTransactions = JSON.parse(localStorage.getItem("transactionList")) || [];

function saveTransactions() {
	localStorage.setItem("transactionList", JSON.stringify(savedTransactions));
}

function createTransaction(name, type, date, amount) {
	const transaction = {
		name,
		type,
		date,
		amount
	};
	savedTransactions.push(transaction);
	saveTransactions();
	updateBalanceValues();
  updateAnalyticValues();
  updateSpendingsByCategory();
	updateExpenceVsIncome();
	updateTransactionsTable();
}

function removeTransaction(id) {
	savedTransactions.splice(id, 1);
	saveTransactions();
	updateBalanceValues();
  updateAnalyticValues();
  updateSpendingsByCategory();
	updateExpenceVsIncome();
	updateTransactionsTable();
}

function updateBalanceValues() {
	let totalBalance = 0;
	let totalIncome = 0;
	let totalExpense = 0;

	savedTransactions.forEach(t => {
		totalBalance += parseFloat(t.amount);
		if (parseFloat(t.amount) >= 0) totalIncome += parseFloat(t.amount);
		else totalExpense += parseFloat(t.amount);
	});

	$("#balance").text("Current balance: " + totalBalance.toFixed(2));
  $("#total-expence").text("Total expence: " + (totalExpense*(-1)).toFixed(2));
	$("#total-income").text("Income: " + totalIncome.toFixed(2));
}

function updateAnalyticValues() {
	let numberOfSpendings = 0;
  let totalSpendings = 0;
  let numberOfGains = 0;
  let totalGains = 0;
  savedTransactions.forEach(t => {
    if(parseFloat(t.amount)<0){
      totalSpendings+=parseFloat(t.amount);
      numberOfSpendings++;
    }
    else{
      totalGains += parseFloat(t.amount);
      numberOfGains++;
    }
  });
  $("#avgSpendings").text("Spend on average: " + ((totalSpendings/numberOfSpendings)*(-1)).toFixed(2));
  $("#avgIncome").text("Income on average: "+(totalGains/numberOfGains).toFixed(2));
}

function updateExpenceVsIncome() {
	let incomeByDate = {};
	let expenseByDate = {};
	let dates = [];

	savedTransactions.forEach(element => {
		if (element.amount <= 0) {
			expenseByDate[element.date] = (expenseByDate[element.date] || 0) + element.amount * (-1);
		} else if (element.amount > 0) {
			incomeByDate[element.date] = (incomeByDate[element.date] || 0) + element.amount;
		}

		if (!dates.includes(element.date)) {
			dates.push(element.date);
			dates.sort();
		}
	});

	let incomeLine = [];
	let expenseLine = [];

	dates.forEach(date => {
		incomeLine.push(incomeByDate[date] || 0);
		expenseLine.push(expenseByDate[date] || 0);
	});

	console.log("Income:" + incomeLine);
	console.log("Expence:" + expenseLine);
	console.log("Dates: " + dates);

	let graph = "https://quickchart.io/chart?bkg=white&c=" + JSON.stringify({
		type: 'line',
		data: {
			labels: dates,
			datasets: [
				{
					label: 'Income',
					data: incomeLine,
					fill: false,
					borderColor: 'green',
				},
				{
					label: 'Expense',
					data: expenseLine,
					fill: false,
					borderColor: 'red',
				},
			],
		},
	});

	$("#expenceVsIncome").attr("src", graph);
}

function updateSpendingsByCategory() {
  let categories = ["Food","Bill","Electronics","Entertainment"];
  let count = [0, 0, 0, 0];
  savedTransactions.forEach(t => {
    let categoryIndex = categories.indexOf(t.type);
    if (categoryIndex !== -1) {
      count[categoryIndex] += (parseFloat(t.amount)*(-1));
    }
  });

  let grap = "https://quickchart.io/chart?bkg=white&c="+JSON.stringify(
  {
    type: 'pie',
    data: {
      labels: categories,
      datasets: [{ data: count }],
    },
  }
  )
  $("#expenceByCategotys").attr("src", grap);
}

function updateTransactionsTable() {
	$("#transactions-table").empty();
	let index = 0;

	savedTransactions.forEach((transaction) => {
		let newRow = document.createElement("tr");
		let actions = document.createElement("td");
		let removeBtn = document.createElement("input");
		removeBtn.type = "button";
		removeBtn.value = "Remove";
		removeBtn.className = "removeBtn";
    removeBtn.id = index;
		
		$(removeBtn).click(function(){
      removeTransaction($(this).attr('id'));
    })
		
		$(actions).append(removeBtn);
		["name", "type", "date", "amount"].forEach(key => {
			let rowItem = document.createElement("td");
			$(rowItem).text(transaction[key]);
			$(newRow).append(rowItem);
		});
		
		$(newRow).append(actions);
		$("#transactions-table").append(newRow);
		index++;
	});
}

$(document).ready(function() {
  updateAnalyticValues();
	updateTransactionsTable();
	updateBalanceValues();
	updateExpenceVsIncome();
  updateSpendingsByCategory();

	console.log('Loaded transactions from localStorage:', JSON.stringify(savedTransactions));
});