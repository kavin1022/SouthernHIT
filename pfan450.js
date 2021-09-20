const hideDiv = (divID) => {
	let x;

	if (typeof divID === 'string' || divID instanceof String){
		x = document.getElementById(divID);
	}else{
		x = document.getElementById(divID.id);
	}
	
	//hide all block except for button block
	const divList = ["homeWrapper", "staffWrapper", "instituteShopWrapper", "userRegWrapper", "guestBookWrapper", "loginSectionWrapper"];
	for (let i = 0; i < divList.length; i++){
		if (divList[i] == divID.id || divList[i] == x){
			continue;
		}
		let y = document.getElementById(divList[i]);
		y.style.display = "none";
	}

	x.style.display = "block";
}

const storeUserDetail = (username, password) => {
	globalUsername = username;
	globalPassword = password;
	loginStatus = true;
	document.getElementById("loginDisplay").innerHTML = username;
}

const triggerLogin = () => {
	hideDiv("loginSectionWrapper");
}

const loginAccount = async () => {
	const username = document.getElementById("loginUsername").value;
	const password = document.getElementById("loginPassword").value;
	const data = {"username": username, "password": password};

	if (username == "" || password == ""){
		document.getElementById("loginMessage").innerHTML = "why you tryin to log in without a name and password";
		return;
	}

	fetch("http://localhost:5000/api/GetVersionA", {
		headers: new Headers({
			"Content-Type": "application/x-www-form-urlencoded",
			"Authorization": "Basic " + btoa(username + ":" + password)
		}),
		method: "GET",
	})
	.then(response => {
		if (response.status == 401){
			document.getElementById("loginMessage").innerHTML = "Your password or username is wrong my bro";
			
		}
		if (response.status == 200){
			document.getElementById("loginMessage").innerHTML = "Loged in, now you can go spend some money in the shop";
			storeUserDetail(username, password);
			alert("Login successfully, please navigate to institute shop to purchase item");
			hideDiv("homeWrapper");
		}
	});
}
const purchaseItem = (id) => {
	if (loginStatus == false){
		hideDiv("loginSectionWrapper");
		alert("Please Login First");
		return;
	}

	const data = {"productID": id, quantity: 1};
	fetch("http://localhost:5000/api/PurchaseItem", {
		headers: new Headers({
			"Content-Type": "application/json",
			"Authorization": "Basic " + btoa(globalUsername + ":" + globalPassword),	
		}),
		method: "POST",
		body: JSON.stringify(data)
	})
	.then(response => {
		if(response.status == 201){
			alert("Item Purchased Successfully");
		}
	});
}
//Shop
const searchItems = async(e) => {
	const parent = document.getElementById("shopItemsWrapper")
	parent.innerHTML = null;

	const updateItemList = (data) => {

		let div = document.createElement("div");
		let textdiv = document.createElement("div");
		let itemTitle = document.createElement("h3");
		let description = document.createElement("p");
		let price = document.createElement("p");
		let img = document.createElement("img");

		itemTitle.appendChild(document.createTextNode(data.name));
		description.appendChild(document.createTextNode(data.description));
		price.appendChild(document.createTextNode("$" + data.price));
		img.src = "http://localhost:5000/api/GetItemPhoto/" + data.id;

		textdiv.appendChild(itemTitle);
		textdiv.appendChild(description);
		textdiv.appendChild(price);

		let btn = document.createElement("button");
		btn.innerHTML = "Purchase Item";
		btn.onclick = () => {purchaseItem(data.id)}
		textdiv.appendChild(btn)

		div.appendChild(img);
		div.appendChild(textdiv);
		parent.appendChild(div);

		img.className = "itemPhoto";
		div.className = "shopItems";

	};



	const searchItemInput = document.getElementById("itemSearchBar");
	fetch("http://localhost:5000/api/GetItems/" + searchItemInput.value, {
		headers: {"Content-Type": "application/json"},
		method: "GET",
	})			
	.then(response => response.json())
	.then(data => {
		for (let i = 0; i < data.length; i++){
			updateItemList(data[i]);
		}
	});
}

//Staff
const getDisplayedStaff = async() => {

	const createStaff = (parent, vccc) => {

		let div = document.createElement("div");
		let textDiv = document.createElement("div");
		let name = document.createElement("p");
		let phoneWrapper = document.createElement("p");
		let phone = document.createElement("a");
		let email = document.createElement("a");
		let interest = document.createElement("p");
		let img = document.createElement("img");

		let nameContent = document.createTextNode(vccc[0]);
		let phoneContent = document.createTextNode(vccc[1]);
		let emailContent = document.createTextNode(vccc[2]);
		let interestContent = document.createTextNode(vccc[3]);
		img.src = "data:image/png;base64, " + vccc[4];

		name.appendChild(nameContent);
		phone.appendChild(phoneContent);
		phone.href="tel:" + vccc[1];
		email.appendChild(emailContent);
		email.href="mailto:" + vccc[2];
		interest.appendChild(interestContent);

		phoneWrapper.appendChild(phone);

		textDiv.appendChild(name);
		textDiv.appendChild(phoneWrapper);
		textDiv.appendChild(email);
		textDiv.appendChild(interest);

		div.className= "staffItem";
		img.className = "staffImage";

		div.appendChild(img);
		div.appendChild(textDiv);
		
		parent.appendChild(div);
	}

	const vCardFormatter = (vcard) => {
		const fullName = vcard.slice(vcard.search("FN:") + 3, vcard.search("UID:") - 1);
		const phoneNumber = vcard.slice(vcard.search("TEL:") + 4, vcard.search("URL:") - 1);
		const email = vcard.slice(vcard.search("EMAIL;") + 16, vcard.search("TEL:") - 1);
		const interest = vcard.slice(vcard.search("CATEGORIES:") + 11, vcard.search("PHOTO") - 1);

		const i = vcard.indexOf("PHOTO;");
		const mark = vcard.indexOf(":", i)
		const j = vcard.indexOf("LOGO");

		const photo = vcard.substring(mark + 1, j);

		return [fullName, phoneNumber, email, interest, photo];
	}

	async function fetchCards(parent, data) {
		for (let i = 0; i < data.length; i++){
			await fetch(`http://localhost:5000/api/GetCard/${data[i].id}`, {})
			.then(response => response.text())
			.then(data => {
				const vccc = vCardFormatter(data)
				createStaff(parent, vccc);
			});
		}
	}

	fetch('http://localhost:5000/api/GetAllStaff')
		.then(response => response.json())
		.then(data => {
			const parent = document.getElementById("staffList");
			fetchCards(parent, data);
		});
}

//User Registration
const registerAccount = async() => {
	const username = document.getElementById("username").value;
	const password = document.getElementById("password").value;
	const address = document.getElementById("address").value;

	const data = {"username": username, "password": password, address: address};
	fetch("http://localhost:5000/api/Register", {
		headers: {"Content-Type": "application/json"},
		method: "POST",
		body: JSON.stringify(data)
	})
	.then(response => response.text())
	.then(data => {
		document.getElementById("resigerStatus").innerHTML = data;
	});
}

//Guest Book
const sendComment = async() => {
	const name = document.getElementById("commentName").value;
	const body = document.getElementById("commentBody").value;

	if (name == "" || body == ""){
		alert("Comment name and body cannot be empty!");
		return;
	}

	const data = {"comment": body, "name": name};
	
	fetch("http://localhost:5000/api/WriteComment", {
		headers: {"Content-Type": "application/json"},
		method: "POST",
		body: JSON.stringify(data)
	}).then(res => {
		alert("Comment Posted!");
		document.getElementById("com").src = document.getElementById("com").src;
	})
}


let loginStatus = false;
let globalUsername, globalPassword;


//enter key triggers login function
let input = document.getElementById("loginPassword");
input.addEventListener("keyup", (e) => {
	if (e.key === "Enter"){
		e.preventDefault();
		loginAccount();
	}
})

//search function listener