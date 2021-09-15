function hideDiv(divID) {
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