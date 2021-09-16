const hideDiv =(divID) => {
	let x = document.getElementById(divID.id);

	//hide all block except for button block
	const divList = ["homeWrapper", "staffWrapper", "instituteShopWrapper", "userRegWrapper", "guestBookWrapper"];
	for (let i = 0; i < divList.length; i++){
		if (divList[i] == divID.id){
			continue;
		}
		let y = document.getElementById(divList[i]);
		y.style.display = "none";
	}

	x.style.display = "block";
}

async function getDisplayedStaff() {

	const createStaff = (parent, vccc) => {

		let div = document.createElement("div");
		let textDiv = document.createElement("div");
		let name = document.createElement("p");
		let phone = document.createElement("p");
		let email = document.createElement("p");
		let interest = document.createElement("p");
		let img = document.createElement("img");

		let nameContent = document.createTextNode(vccc[0]);
		let phoneContent = document.createTextNode(vccc[1]);
		let emailContent = document.createTextNode(vccc[2]);
		let interestContent = document.createTextNode(vccc[3]);
		img.src = "data:image/png;base64, " + vccc[4];

		name.appendChild(nameContent);
		phone.appendChild(phoneContent);
		email.appendChild(emailContent);
		interest.appendChild(interestContent);

		textDiv.appendChild(name);
		textDiv.appendChild(phone);
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

	fetch('http://localhost:5000/api/GetAllStaff')
		.then(response => response.json())
		.then(data => {
			const parent = document.getElementById("staffList");
			console.log(data);

			for (let i = 0; i < data.length; i++){
				fetch(`http://localhost:5000/api/GetCard/${data[i].id}`, {})
				.then(response => response.text())
				.then(data => {
					const vccc = vCardFormatter(data)
					createStaff(parent, vccc);
				});
			}

			/*
			fetch('http://localhost:5000/api/GetCard/7247480', {})
				.then(response => response.text())
				.then(data => {
					const vccc = vCardFormatter(data)
					createStaff(parent, vccc);
				});
			*/
		});
}
//https://cws.auckland.ac.nz/335a3/api/GetCard/${data[i].id}