var goldOn = false;  /*variable for determining whether a gold coin is currently on screen, 
due to a bug only one gold coin could be present at a time but also to avoid users being able to overcrowd the page the bug was never fixed and became a feature*/

//hiding elements at start of game
document.getElementById("gold_display").style.display = "none";
document.getElementById("goldfinder").style.display = "none";
document.getElementById("inventory").style.display = "none";
document.getElementById("elfqueen").style.display = "none";
	
//RESOURCES FACTORY\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
	
//creates a generic resource class, the qualities assigned can be overridden
//also several useful methods for transactions here
var resource = {
	//basic attributes of resources
    name: 'resource',
    amountOwned: 0,
    basePrice: 100,
	incPerSec: 1,
	incrementorOf: 'gold',  //all other attributes are self explanatory, however incrementorOf simply defines which resource the current item increments (if any)
    buyUnit: 'gold',
    previousAmountOwned: 0,

	//function to add items to inventory, creates necessary HTML elements inside the inventory for updateable amount display.
	//takes a description input for unique inventory display names
	addToInvent: function(description) {
		var itemDisplay = document.createElement(this.name + 'Display');
		itemDisplay.setAttribute("id", this.name + "_display");
		
		document.getElementById('inventory').appendChild(itemDisplay);
		itemDisplay.innerHTML = description;
		var itemAmount = document.createElement(this.name +'Amount');
		itemAmount.setAttribute("id", this.name + "_amount");
		
		document.getElementById(this.name + '_display').appendChild(itemAmount);
		itemAmount.innerHTML = this.amountOwned;
	},
	
	//for setting up the timed increments, the amount of currency given per second * how many of that item owned
	tick: function() {
	var incItem = tradeResources[this.incrementorOf];
	incItem.amountOwned += (this.amountOwned * this.incPerSec);
	incItem.updateAmountDisplay();
	},
	
	//an add function that adds the amount purchased to the amount owned and will update the inventory/shop price
    add: function(amount) {
        this.amountOwned += amount;
        this.updateAmountDisplay();
        this.updatePriceDisplay();
    },
	//same function as add but subtract
	subtract: function(amount) {
        this.add(-amount);
        this.updateAmountDisplay();
        this.updatePriceDisplay();
    },
	
	//each time the player purchases an item its price will increase
    getPrice: function() {
        return Math.floor(this.basePrice * Math.pow(1.4, this.amountOwned));
    },

	//updates the element in the shop that contains the item price
    updatePriceDisplay: function() {
        var costElement = document.getElementById(this.name + '_cost');
        if (costElement) {
            costElement.innerHTML = this.getPrice();
        }
    },
	//lets the item appear in player inventory if it is the first one bought, updates the amount owned
    updateAmountDisplay: function() {
        var displayElement = document.getElementById(this.name + '_display');
        var amountElement = document.getElementById(this.name + '_amount');
        if (amountElement) {
            amountElement.innerHTML = this.amountOwned;
        }
    },
	//adds 1 of item to amount owned, adjusts price in shop  and deducts cost of item from coins
    buy: function() {
        var priceResource = tradeResources[this.buyUnit];
        var price = this.getPrice();
        if (priceResource.amountOwned >= price) {
            priceResource.subtract(price);
            this.add(1);
        }
    },
};

// CURRENCIES /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//creating trade resources like gold and blessing for use in transactions

var tradeResources = {};

tradeResources.gold = Object.create(resource);
tradeResources.gold.name = 'gold';

tradeResources.blessing = Object.create(resource);
tradeResources.blessing.name = 'blessing';


//ITEMS CREATION\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

resource.amulet = Object.create(resource);
resource.amulet.name = 'amulet';
resource.amulet.basePrice = 15;
document.getElementById('amulet_store').addEventListener('click', function() {
    var amuletsOwned = resource.amulet.amountOwned;
	if (amuletsOwned === 0){
		resource.amulet.buy(1);
		resource.amulet.addToInvent("Holy Amulet: ");
		resource.amulet.updateAmountDisplay()
	} else {
		resource.amulet.buy(1);
		resource.amulet.updateAmountDisplay()
	};
	//sets tick function to run every 1000 milliseconds (1 second)
	setInterval(function(){resource.amulet.tick()}, 1000);
	
});

resource.luckPotion = Object.create(resource);
resource.luckPotion.name = 'luckPotion';
resource.luckPotion.basePrice = 15;
document.getElementById('luckPotion_store').addEventListener('click', function() {
   var luckPotionOwned = resource.amulet.amountOwned;
	if (luckPotionOwned === 0){
		resource.luckPotion.buy(1);
		resource.luckPotion.addToInvent("Holy Amulet: ");
		resource.luckPotion.updateAmountDisplay()
	} else {
		resource.luckPotion.buy(1);
	};
	
});



//BUTTONS/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//when the elfqueen is clicked, add 1 to blessing using the add function previously created, change the inner html and display the well of riches button on the appropriate story pieces
document.getElementById("elfqueen").addEventListener('click', function () {
	if (steps < 5){
		tradeResources.blessing.add(1);
		};
	if (steps > 0 && steps < 4){
		takeStep();
		if (steps > 1){
			document.getElementById('buttontext').innerHTML = "Pray to the Queen";
		};
	};
	if (steps === 3){
		document.getElementById("goldfinder").style.display = "inline-block";
	};
});

// Look around button for the very first step of the game
document.getElementById("lookaround").addEventListener('click', function () {
	if (steps === 0){
		takeStep();
		document.getElementById("lookaround").style.display = "none";
		document.getElementById("elfqueen").style.display = "inline-block";
	};
});



/*Well of Riches Button
creates a set of co-ordinates using the dimensions of the document body minus a chosen elements' dimensions, and a random number. in this case it will be the coin*/
function getRandomPosition(element) {
	var x = document.body.offsetHeight-element.clientHeight;
	var y = document.body.offsetWidth-element.clientWidth;
	var randomX = Math.floor(Math.random()*x);
	var randomY = Math.floor(Math.random()*y);
	return [randomX,randomY];
}

/*on click of the Coin Well button a gold coin is added at a random location on the page, the random location is taken from the previous bit of code
some styles and attributes of the element are also modified here, for example on hover over the coin the cursor will turn into a pointer indicating the player may click*/

document.getElementById("goldfinder").addEventListener('click', function(){
	var coinChance = Math.floor((Math.random()*100)+1);
	if (coinChance > 30 && goldOn === false){
		var img = document.createElement('img'); //creates element called 'img'
		var imgoffset = document.getElementById("textBox");
		goldOn = true;
		img.setAttribute("id", "coin");                      //attributes and style of created element
		img.setAttribute("style", "position:absolute;");
		img.setAttribute("src", "images/coin.png");
		document.body.appendChild(img);
		var xy = getRandomPosition(img); 
		img.style.top = xy[0] + 90  + 'px';  //creating a higher co-ordinate for the  
		img.style.left = xy[1] + 40 + 'px';
		img.style.cursor = "pointer" ;
		img.style.zIndex = "100";
		
		/*coinchance creates a random number between 1 and 100 and the following code only executes 
if coinChance is greater than 50 so there's a 1/2 chance to find a coin each click*/
	


	//creates an easy way to call the coin by its' ID
	var coinIcon = document.getElementById("coin");
		
	//when coin is clicked, +1 to gold counter and delete the coin
	coinIcon.addEventListener('click', function(){
		if (tradeResources.gold.amountOwned === 0){
			document.getElementById('gold_display').style.display = 'block';
		};
		tradeResources.gold.add(15);
		goldOn = false;
		coinIcon.parentNode.removeChild(coinIcon);
		});
	} else { textBox.innerHTML = "<p>" + "You found nothing in the Well of Riches this time" + "</p>" + textBox.innerHTML;
	};
});




// STORY \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//html element to display story in
var textBox = document.getElementById('textBox');
var steps = 0
//array to hold all the story pieces
var story = [
	{ steps: 1, text: 'Opening your eyes you find yourself in the palace of the Elf Queen, Whitespire, although weren’t you just at the Forest Tavern enjoying a cold Leafbrew? As you regain your senses you realise the Court Mages must have summed you to consult with the Queen, maybe it’s about all those rumours of some great evil lurking in the forest you’ve been hearing lately.<br>' },
	{ steps: 2, text: 'As is custom you take a knee and offer your prayers to the Queen, it is said that those who are blessed carry the light of the Queen wherever they go.<br>'},
	{ steps: 3, text: '“Most trusted friend of the Royal family, I apologise for the confusion but dark times have descended upon our Kingdom and we require your urgent assistance. Creatures from the Void Realm roam our forests as we speak, carving scars through the land and annihilating all life in their path. As of yet, we have no idea where they came from although their movements suggest they travelled from the mountains in the East. Go there and consult with the Men and the Dwarves, discover if they know more than we. Take gold from the Well of Riches and perhaps something to protect you.” <br>'},
	{ steps: 4, text: 'The honour of a personal request from the Queen is too great to decline, so after thanking her for her kindness and bidding all in the Spire farewell, you are ready leave on your journey to the east. It may be wise to grab some supplies.<br>'},
	{ steps: 5, text: 'The Forest<br><br>Beyond the Spire gates lies the Queens forest, as emissary to the High Elf council you are to travel east to consult with the League of Dwarves and Men, hopefully to discover the origins of these creatures of the night.<br>'},
]

//function for progressing through the story, adds 1 to the steps variable if called and displays the corresponding item from the 'story' array
function takeStep(){
	steps++;
	
	//first item in story array
	var storyBit = story[0];
	
	//check if the number of steps is enough for the story piece to show
	if (steps >= storyBit.steps) {
	story.shift();
	textBox.innerHTML = "<p>" + storyBit.text + "</p>" + textBox.innerHTML;
		};
};
	


	


