var gold = 0;
var blessing = 0;
var coinOn = false;

//hides gold and shop at beginning of game
document.getElementById("gold_amount").style.display = "none";
document.getElementById("goldfinder").style.display = "none";
document.getElementById("shop").style.display = "none";

//when elf queeen image is clicked the blessings counter increments by 1 and the text in the blessings_counter span is changed to the new blessings value
//shows gold counter if blessings counter is above 10

	

document.getElementById("elfqueen").addEventListener('click', function () {
	blessing++;
	document.getElementById("blessing_counter").innerHTML = +blessing;
	if (blessing > 10){
	document.getElementById("gold_amount").style.display = "block";
	document.getElementById("goldfinder").style.display = "block";
	
	};
});

	


//creates a random position based on the height and width of the page
function getRandomPosition(element) {
	var x = document.body.offsetHeight-element.clientHeight;
	var y = document.body.offsetWidth-element.clientWidth;
	var randomX = Math.floor(Math.random()*x);
	var randomY = Math.floor(Math.random()*y);
	return [randomX,randomY];
}

//on click of the Look Around button a gold coin is added at a random location on the page, the random location is taken from the previous bit of code
/*some styles and attributes of the element are also modified here, for example on hover over the coin the cursor will turn into a pointer indicating the player may click*/
document.getElementById("goldfinder").addEventListener('click', function(){
	/*coinchance creates a random number between 1 and 100 and the following code only executes 
	if coinChance is greater than 50 so there's a 1/2 chance to find a coin each click*/
	var coinChance = Math.floor((Math.random()*100)+1);
	if (coinChance > 50 && coinOn === false){
		var img = document.createElement('img');
		coinOn = true;
		img.setAttribute("id", "coin");
		img.setAttribute("style", "position:absolute;");
		img.setAttribute("src", "images/coin.png");
		document.body.appendChild(img);
		var xy = getRandomPosition(img);
		img.style.top = xy[0] + 'px';
		img.style.left = xy[1] + 'px';
		img.style.cursor = "pointer" ;

		//creates an easy way to call the coin by its' ID
	var coinIcon = document.getElementById("coin");
		
		//when coin is clicked, +1 to gold counter and delete the coin
		coinIcon.addEventListener('click', function(){
			gold++;
			coinOn = false;
			document.getElementById("gold_counter").innerHTML = +gold;
			coinIcon.parentNode.removeChild(coinIcon);
		});
		} else { alert("You found nothing");
		};
		//if player has 5 gold or above, display the shop
		if (gold > 4){
			document.getElementById("shop").style.display = "block";
		};
});
	


	


