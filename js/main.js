var goldOn = false;  /*variable for determining whether a gold coin is currently on screen, 
only one gold coin can be present at a time to avoid users being able to overcrowd the page*/
var shift = 0;
start = clicks = frequency = 0
/*event listener to check if on resize the window is landscape, if so display the maintenance message. remove if back to portrait
however if the user starts the game in landscape the message will not show. 
Separate function for initial load up of game in case player starts off in landscape, as the event listener only handles a resize event*/
var x;
var stepsLoadNew;

//device orientation sometimes is non-functional
window.addEventListener("deviceorientation",function(){
	var checkBlock = document.getElementById('landscapeblock');
    if(document.documentElement.clientHeight < document.documentElement.clientWidth && checkBlock === null) 
    {  
			var img = document.createElement('img');
			img.setAttribute("id", "landscapeblock");                      //attributes and style of created element
			img.setAttribute("style", "position:absolute;");
			img.setAttribute("src", "images/landscapeblock.jpg");
			document.body.appendChild(img);
			img.style.height = '100%';
			img.style.width = '100%';
			img.style.zIndex = "100";
			img.style.left = '0px';
			img.style.top = '0px';
	} else {
		var blockRemove = document.getElementById("landscapeblock");
		if(checkBlock){
        blockRemove.parentNode.removeChild(blockRemove);};
    };
});



	
//RESOURCES FACTORY\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
	
//creates a generic resource class, the qualities assigned can be overridden
//also several useful methods for transactions here
var resource = {
	//basic attributes of resources
    name: 'resource',
    amountOwned: 0,
    basePrice: 100,
	incPerSec: 2,
	incrementorOf: 'gold',  //all other attributes are self explanatory, however incrementorOf simply defines which resource the current item increments (if any)
    buyUnit: 'gold',
    previousAmountOwned: 0,

	//function to add items to inventory, creates necessary HTML elements inside the inventory for updateable amount display.
	//takes a description input for unique inventory display names
	addToInvent: function(title, description) {
		var bagCheck = document.getElementById('bag-cont').innerHTML;
		if (bagCheck === "Your BAG is currently empty!"){
			document.getElementById('bag-cont').innerHTML =  " ";
		} ;

		var itemDisplay = document.createElement(this.name + 'Display');
		itemDisplay.setAttribute("id", this.name + "_display");
		itemDisplay.setAttribute("class", "bag-item");
		
		document.getElementById('bag-cont').appendChild(itemDisplay);
		itemDisplay.innerHTML = description;
		var itemAmount = document.createElement(this.name +'Amount');
		itemAmount.setAttribute("id", this.name + "_amount");
		
		

		itemDisplay.innerHTML = "<img src='images/" + this.name + "_pic.png' class='bag-img'>" + "<span class='bag-title'>" + title + "</span> <span class='bag-desc'>" + description + "</span>";
		document.getElementById(this.name + '_display').appendChild(itemAmount);
		itemAmount.innerHTML = this.amountOwned;
		document.getElementById('textbox').innerHTML = "<p>You bought" + " " + title + "!</p>" + document.getElementById('textbox').innerHTML;
		
	},
	//checks for placeholder text and removes it, then populate the shop with the corresponding item, adds event listener for purchasing the item
	addToShop: function(title, description) {
		var shopCheck = document.getElementById('shop-cont').innerHTML;
		if (shopCheck === "You should speak to the Queen before visiting the SHOP." || shopCheck === "There is no shop here, please check back later."){
			document.getElementById('shop-cont').innerHTML =  " ";
		} ;
		var itemDisplay = document.createElement(this.name + 'Shop');
		itemDisplay.setAttribute("id", this.name + "_shop");
		itemDisplay.setAttribute("class", "shop-item");
		document.getElementById('shop-cont').appendChild(itemDisplay);

		

		itemDisplay.innerHTML = "<img src='images/" + this.name + "_pic.png' class='shop-img'>" + "<span class='shop-title'>" + title + "</span> <span class='shop-desc'>" + description + "</span> ";

		var buyNow = this;

		var itemButton = document.createElement("BUTTON");
		itemButton.setAttribute("id", this.name + "-buy");
		itemButton.innerHTML = "Buy Now";
		itemButton.setAttribute("class", "shop-button");
		document.getElementById(this.name + "_shop").appendChild(itemButton);
		itemButton.onclick = function () {
    		buyNow.buy();
    		if (buyNow.amountOwned > 0){
    		buyNow.addToInvent(title, description);
    		buyNow.useItemButton();
    		} else {
    		document.getElementById('textbox').innerHTML = "You don't have enough gold to afford this yet!<br>" + document.getElementById('textbox').innerHTML;
    		}
		};

	},
	//Clears the shop and adds some placeholder text
	clearShop: function(){
		var myNode = document.getElementById("shop-cont");
		while (myNode.firstChild) {
		   myNode.removeChild(myNode.firstChild);
		}
		myNode.innerHTML = "There is no shop here, please check back later."
	},

	//creates a 'use item' button and handles the individual functions of each item with a switch statement, kind of a clunky approach but no other methods worked
	useItemButton: function() {
		var useButton = document.createElement(this.name + 'Use');
		
		var btn = document.createElement("BUTTON");        // Create a button
		var t = document.createTextNode("Use Item");		// Create a text node to apply to the button in a sec
		btn.setAttribute("id", this.name + '_use');
		btn.setAttribute("class", "shop-button");
		btn.appendChild(t);                                // Append the text to <button>
		var name = this.name;
		document.getElementById(this.name + '_display').appendChild(btn);                    // Append <button> to to the item display in the inventory
		document.getElementById(this.name + '_display').innerHTML = document.getElementById(this.name + '_display').innerHTML + '<br>';
		console.log(name);

		switch(name){
		case "amulet":
		document.getElementById("amulet_use").addEventListener("click", function(){
			document.getElementById('amulet_use').style.display = 'none';
			document.getElementById('textbox').innerHTML = "<p>The Amulet is encrusted with jewels and glows brilliantly, but it doesn't actually <i>do</i> anything. Maybe it will serve some purpose in the future, so you keep hold of it!</p>" + document.getElementById('textbox').innerHTML;
		});
		break;
		case "luckPotion":
			document.getElementById("luckPotion_use").addEventListener("click", function(){	
				resource.luckPotion.subtract(1);
				resource.luckPotion.updateAmountDisplay()
				var j = setInterval(function(){
					var x = Math.floor((Math.random()*15)+1);  //when the luck potion is used the player has the chance to find between 6-15 gold every two seconds for 10 seconds
					if (x > 5){									// x is used as the amount of gold given as well as the if parameter
						tradeResources.gold.add(x);
						document.getElementById('textbox').innerHTML = "<p>You found " + x + "gold! That luck potion really paid off.</p>" + document.getElementById('textbox').innerHTML;
					};
				}, 2000);
				
				setTimeout(function( ) { clearInterval( j ); }, 10000);
				document.getElementById('luckPotion_display').style.display = 'none';
				document.getElementById('textbox').innerHTML = "<p>You used the Luck Potion! Maybe you'll find some gold!</p>" + document.getElementById('textbox').innerHTML;
			});
		break;
		case "shovel":
			document.getElementById("shovel_use").addEventListener("click", function(){	
			document.getElementById('shovel_use').style.display = 'none';
			document.getElementById('textbox').innerHTML = "<p>You inspect the shovel, it looks sturdy and strong. When you are on soft ground you will be able to dig from the Actions menu.</p>" + document.getElementById('textbox').innerHTML;
		
		});
		break;
		};
	},
	
	//for setting up the timed increments, the amount of currency given per second
	tick: function() {
	var incItem = tradeResources[this.incrementorOf];
	incItem.amountOwned += (this.incPerSec);
	incItem.updateAmountDisplay();
	},
	
	//an add function that adds the amount purchased to the amount owned and will update the inventory/shop price
    add: function(amount) {
        this.amountOwned += amount;
        this.updateAmountDisplay();
        this.updatePriceDisplay();
    },
	//same function as add 	but subtract
	subtract: function(amount) {
        this.add(-amount);
        this.updateAmountDisplay();
        this.updatePriceDisplay();
    },

    hpAdd: function(amount){
    	this.amountOwned += amount;
    	document.getElementById('hpbar').value = this.amountOwned += amount;
    },

    hpSubtract: function(amount){
    	this.add(-amount);
    	document.getElementById('hpbar').value = tradeResources.hp.amountOwned;

    },
	
	//each time the player purchases an item its price will increase
    getPrice: function() {
        return Math.floor(this.basePrice * Math.pow(1.4, this.amountOwned));
    },

	//updates the element in the shop that contains the item prices
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
            var element = document.getElementById(this.name + '_shop');
            element.parentNode.removeChild(element);
        }
    },
};





// CURRENCIES /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//creating trade resources like gold and hp

var tradeResources = {};

tradeResources.gold = Object.create(resource);
tradeResources.gold.name = 'gold';

tradeResources.hp = Object.create(resource);
tradeResources.hp.name = 'hp';
tradeResources.hp.amountOwned = 100;


//ITEMS CREATION\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

/*palace store*/
resource.amulet = Object.create(resource);
resource.amulet.name = 'amulet';
resource.amulet.basePrice = 15;
function amuletUse (){
	document.getElementById('amulet_use').addEventListener("click", function(){
		resource.amulet.useItem(amulet);
	});
};

resource.luckPotion = Object.create(resource);
resource.luckPotion.name = 'luckPotion';
resource.luckPotion.basePrice = 15;


resource.shovel = Object.create(resource);
resource.shovel.name = 'shovel';
resource.shovel.basePrice = 5;

/*forest store*/

resource.tinderBox = Object.create(resource);
resource.tinderBox.name = 'tinderBox';
resource.tinderBox.basePrice = 25;

resource.hpPotion = Object.create(resource);
resource.hpPotion.name = 'hpPotion';
resource.hpPotion.basePrice = 15;

resource.repairKit = Object.create(resource);
resource.repairKit.name = 'repairKit';
resource.repairKit.basePrice = 15;

/*PANELS*/
/*on click of the Coin Well button a gold coin is added at a random location on the page, the random location is taken from the previous bit of code
some styles and attributes of the element are also modified here, for example on hover over the coin the cursor will turn into a pointer indicating the player may click*/


var panel1 = document.getElementById("panel1");
var panel3 = document.getElementById("panel3");
var panel2 = document.getElementById("panel2");
var panel4 = document.getElementById("panel4");

if(!steps){
panel1.innerHTML= "<img class='panel-img' src='images/lookaround.png'><span class='panel-txt'>Look Around</span>";
};

panel1.addEventListener('click', function(){
	if(steps < 1 ){
		x = 0;
		takeStep();
	} else if(steps >= 1 && steps < 6) {
		document.getElementById('textbox').innerHTML ="<p>Beautifully crafted mosaics line the walls, they mostly depict famous Elven legends.</p>" + document.getElementById('textbox').innerHTML;
	} else if(steps >= 6 && steps < 28) {
		takeStep();
	} else if (steps === 28) {
		takeStep(1);
	}

});


panel3.addEventListener('click', function(){
	if (steps > 1 && steps < 6){
		/*Well of Riches Button
		creates a set of co-ordinates using the dimensions of the document body minus a chosen elements' dimensions, and a random number. in this case it will be the coin*/
		function getRandomPosition(element) {
		var x = document.body.offsetHeight-element.clientHeight-30;
		var y = document.body.offsetWidth-element.clientWidth;
		var randomX = Math.floor(Math.random()*x);
		var randomY = Math.floor(Math.random()*y);
		return [randomX,randomY];
		};

		var coinChance = Math.floor((Math.random()*100)+1);
		if (coinChance > 30 && goldOn === false){
			var img = document.createElement('img'); //creates img element
			var imgoffset = document.getElementById("textbox");
			goldOn = true;
			img.setAttribute("id", "coin");                      //attributes and style of created element
			img.setAttribute("style", "position:absolute;");
			img.setAttribute("src", "images/coin.png");
			document.body.appendChild(img);
			var xy = getRandomPosition(img); 
			img.style.top = xy[0] + 80  + 'px';  //adding pixel values on to the random co-ordinates, helping to place the coins only towards the top of the screen so the user doesn't accidentally press any of the controls
			img.style.left = xy[1] + 40 + 'px';
			img.style.cursor = "pointer" ;
			img.style.zIndex = "100";
			
			/*coinchance creates a random number between 1 and 100 and the following code only executes 
			if coinChance is greater than 50 so there's a 1/2 chance to find a coin each click*/
		
			document.getElementById('textbox').innerHTML = "<p>" + "Look, a coin! Grab it!" + "</p>" + document.getElementById('textbox').innerHTML;

			//creates an easy way to call the coin by its' ID
			var coinIcon = document.getElementById("coin");
				
			//when coin is clicked, +1 to gold counter and delete the coin
			coinIcon.addEventListener('click', function(){
				tradeResources.gold.add(15);
				goldOn = false;
				coinIcon.parentNode.removeChild(coinIcon);
				});
		} else { 
			document.getElementById('textbox').innerHTML = "<p>" + "You found nothing in the Well of Riches this time" + "</p>" + document.getElementById('textbox').innerHTML;
		};
	} else if (steps >= 6 && resource.shovel.amountOwned > 0) {
	    		var digChance = Math.floor(Math.random() * (10 + 1) - 1);
	    		var digAmt = Math.floor(Math.random() * (5 + 1) + 1);
	    		if (digChance < 5){
	    			tradeResources.gold.add(digAmt);
	    			document.getElementById('textbox').innerHTML = "<p>" + "You found " + digAmt + " gold while digging!</p>" + document.getElementById('textbox').innerHTML;

    			} else {
    				document.getElementById('textbox').innerHTML = "<p>You dug up nothing this time.</p>" + document.getElementById('textbox').innerHTML;

    			}
    		};
});


panel2.addEventListener('click', function(){
	if (steps >= 1 && steps < 6){
		takeStep();
		switch(steps){
			case 2: panel3.innerHTML = "<img class='panel-img' src='images/wellofriches.png'><span class='panel-txt'>Use Well of Riches</span>";
			break;
			case 3: resource.luckPotion.addToShop("Luck Potion", "Wealth follows those who imbibe this mystical brew!");
				resource.amulet.addToShop("Amulet", "May protect you in times of trouble.");
				resource.shovel.addToShop("Shovel", "The Royal forest is rife with gold, maybe you can dig some up.");
			break;

		}
	} else if (steps >= 6 && steps < 9 ){
		document.getElementById('textbox').innerHTML = "<p>The forest seems infinite as you gaze outward into the vast sea of greens and browns before you.</p>" + document.getElementById('textbox').innerHTML;

	}
});
var clicks = 0;
panel4.addEventListener('click', function(){
	if (steps === 11){
		takestep(1);
	} else if (steps === 28){
		if(!clicks){
		setInterval(function(){ clicks = 0 }, 2000);
		}
		clicks++;
		console.log(clicks);

		if(clicks === 6){
			takeStep();
		}
	}
		
});


// STORY \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

// getgethtml element to display story in
var textBox = document.getElementById('textBox');
if (!steps){
	var steps = 0;
};
//array to hold all the story pieces, the story pieces also sometimes have functions (doSomething), that will execute along with the story piece.
var story = [
	{ steps: 1, text: 'Opening your eyes you find yourself in the palace of the Elf Queen, Whitespire, although weren’t you just at the Forest Tavern enjoying a cold Leafbrew? As you regain your senses you realise the Court Mages must have summed you to consult with the Queen, maybe it’s about all those rumours of some great evil lurking in the forest you’ve been hearing lately.<br>', doSomething: function(){console.log(steps); panel2.innerHTML = "<img class='panel-img' src='images/royalseal.png'><span class='panel-txt'>Talk to the Queen</span>"} },
	{ steps: 2, text: 'As is custom you take a knee and offer your prayers to the Queen, it is said that those who are blessed carry the light of the Queen wherever they go.<br>'},
	{ steps: 3, text: '“Most trusted friend of the Royal family, I apologise for the confusion but dark times have descended upon our Kingdom and we require your urgent assistance. Creatures from the Void Realm royalsealm our forests as we speak, carving scars through the land and annihilating all life in their path. As of yet, we have no idea where they came from although their movements suggest they travelled from the mountains in the East. Go there and consult with the Men and the Dwarves, discover if they know more than we. Take gold from the Well of Riches and some supplies from the <span class="greentext">SHOP</span> .” <br>'},
	{ steps: 4, text: 'The honour of a personal request from the Queen is too great to decline, so after thanking her for her kindness and bidding all in the Spire farewell, you are ready leave on your journey to the east. It may be wise to grab some supplies from our <span font-color="red">SHOP</span>.<br>', doSomething: function(){panel2.innerHTML = "<img class='panel-img' src='images/royalseal.png'><span class='panel-txt'>Leave the Palace</span>"}},
	{ steps: 5, text: 'Have you got everything you need? <span class="redtext">You will not be able to return here.</span>'},
	{ steps: 6, text: 'Beyond the Spire gates lies the Queens forest, as emissary to the High Elf council you are to travel east to consult with the League of Dwarves and Men, hopefully to discover the origins of these creatures of the night.<br> <h1><span class="purpletext">The Forest</span></h1>', doSomething: function(){ resource.repairKit.clearShop(); if (resource.shovel.amountOwned > 0){panel1.innerHTML = "<img class='panel-img' src='images/forest.png'><span class='panel-txt'>Enter the forest.</span>"; panel2.innerHTML = "<img class='panel-img' src='images/lookaround.png'><span class='panel-txt'>Look around</span>"; panel3.innerHTML = "<img class='panel-img' src='images/shovel_pic.png'><span class='panel-txt'>Dig for gold</span>"; } else { panel3.innerHTML = " "; panel1.innerHTML = "<img class='panel-img' src='images/forest.png'><span class='panel-txt'>Enter the forest.</span>"; panel2.innerHTML = "<img class='panel-img' src='images/lookaround.png'><span class='panel-txt'>Look around</span>";}}},
	{ steps: 7, text: 'You venture into the forest.', doSomething: function(){panel1.innerHTML = "<img class='panel-img' src='images/forest.png'><span class='panel-txt'>Keep Walking</span>" } },
	{ steps: 8, text: 'A thick, damp canopy of leaves overhead blocks out most of the sunlight.' },
	{ steps: 9, text: 'Hearing a rustle in the bushes, you slow your pace and turn your head. A small group of bandits in full armour stand behind you with weapons drawn.', doSomething: function(){panel1.innerHTML = "<img class='panel-img' src='images/run.png'><span class='panel-txt'>Run!</span>" } },
	{ steps: 10, text: 'You try to run, but the bandit Chief steps out in-front of you from behind a tree. His gruff, gravelly voice breaks the silence: “Halt! It seems you’ve taken something of a wrong turn young Elfkind, this is Wolfraider territory. Luckily enough for you we are a little preoccupied with the strange beasts that have been appearing across the forest recently, so you are not to become our prisoner today. We could, however, use some supplies; so hand over your gold or face my blade!” ', doSomething: function(){
				panel1.innerHTML = "<img class='panel-img' src='images/shield.png'><span class='panel-txt'>Fight!</span>"; 
				panel4.innerHTML = "<img class='panel-img' src='images/purse.png'><span class='panel-txt'>Hand over gold</span>";}},
	{ steps: 11, text: " ", 
				doSomething: function(hearer){						//handling the first proper encounter, the bandits. there are 3 outcomes here handled by if/else if/else statement
				var textBox = document.getElementById('textbox'); 
				var amuletCheck = resource.amulet.amountOwned; 
				if(amuletCheck > 0 && !hearer){
					textBox.innerHTML = 'You feel the Holy Amulet starts to rattle against your ribcage, followed by a blinding light and a calming aura. You slip away amid the confusion, shaken but grateful to have escaped the bandits.' + textBox.innerHTML;
					panel1.innerHTML = "<img class='panel-img' src='images/forest.png'><span class='panel-txt'>Keep Walking</span>";
					panel4.innerHTML = " ";
				} else if (hearer = 1) {
					textBox.innerHTML = 'The Wolfraider Chief steps forward and grabs your gold, he then delivers a swift blow to the side of your head<span class="redtext">(-20hp)</span>. The bandits scramble off into the bushes. "Thanks, sucker!" one of them calls.' + textBox.innerHTML;
					tradeResources.hp.hpSubtract(20); 
					var goldOwned = tradeResources.gold.amountOwned;
					tradeResources.gold.subtract(goldOwned); 

					panel1.innerHTML = "<img class='panel-img' src='images/forest.png'><span class='panel-txt'>Keep Walking</span>";
					panel4.innerHTML = " ";
				} else {
					textBox.innerHTML = 'The wind is knocked out of you with a solid *THUD* in your back, followed by a sharp pain. A Wolfraider Bandit has stabbed you <span class="redtext">(-50hp)</span>. The bandits have your gold and are scrambling off into the buses. "Thanks, sucker!" one of them calls. You collect a couple of pieces of gold that were dropped in the struggle.' + textBox.innerHTML;
					tradeResources.hp.hpSubtract(50); 
					var goldOwned = tradeResources.gold.amountOwned; 
					var percent = (70 / 100) * goldOwned; 
					goldOwned = goldOwned -= percent;
					panel1.innerHTML = "<img class='panel-img' src='images/forest.png'><span class='panel-txt'>Keep Walking</span>";
					panel4.innerHTML = " ";

				}
			}
		},
	{ steps: 12, text: 'The sky grows dark but you’re sure it’s only early afternoon.' },
	{ steps: 13, text: 'There’s a menacing stillness about the air.' },
	{ steps: 14, text: 'Was that lightning?' },
	{ steps: 15, text: 'Maybe you just lost track of time.' },	
	{ steps: 16, text: 'It sure is lonely out here...' },
	{ steps: 17, text: 'The air temperature suddenly drops and a feeling of despair overcomes you, as if the air was soaked in sadness.' },
	{ steps: 18, text: 'The colour now begins to bleed from your vision, is this the work of these dark creatures?' },
	{ steps: 19, text: 'The darkness slowly passes, and with it go the curious effects upon your mind.' },
	{ steps: 20, text: 'What <i>was</i> that? You have never experienced anything quite like it.' },
	{ steps: 21, text: 'You press on so that you may put some ground between you and whatever just happened.' },
	{ steps: 22, text: 'What luck! There appears to be a travelling <span class="greentext">MERCHANT</span> ahead, perhaps he has something you may need for the journey.' },
	{ steps: 23, text: '“Hi there traveller!” calls the merchant, “Heading east are we? It’s a long journey to anywhere in that direction. Please feel free to browse my <span class="greentext">SHOP</span>, I think you’ll find the prices to your liking.”', doSomething: function(){
			resource.repairKit.addToShop("Repair Kit", "Makes any tool as good as new!");
			resource.hpPotion.addToShop("HP Potion", "A natural cocktail of the finest ingredients, drink to restore 30HP.");
			resource.tinderBox.addToShop("Tinder Box", "The forest gets awfully cold and dark at night.");
		} 
	},
	{ steps: 24, text: 'Make sure you have everything you need before you leave, <span class="redtext">there might not be another merchant for a while.</span>' },
	{ steps: 25, text: '“Goodbye traveller, good luck!” you hear the merchant call as he disappears into the forest.' },
	{ steps: 26, text: 'So you’re alone again.' },
	{ steps: 27, text: 'It’s getting late, maybe it’s time to light a fire and settle down.', doSomething: function(){ 				
			panel4.innerHTML = "<img class='panel-img' src='images/tinderbox_pic.png'><span class='panel-txt'>Tap rapidly to light a fire!</span>"; 
			panel1.innerHTML = "<img class='panel-img' src='images/sleep.png'><span class='panel-txt'>Sleep.</span>"; 
		} 
	},
	{ steps: 28, text: " ", doSomething: function(hearer){ 
			var textBox = document.getElementById('textbox');
			var tinderCheck = resource.tinderBox.amountOwned; 
			if(tinderCheck > 0 && !hearer){ 
				textBox.innerHTML = 'Lighting a fire: tap the Tinder Box button as fast as you can to cause a spark.' + textBox.innerHTML;
			}else if (hearer = 1) {
				textBox.innerHTML = "Forgoing a campfire, you lay your head down for the night. Your bones ache; today has been quite an adventure! It doesn't take long before you're fast asleep." + textBox.innerHTML;
			}else{
				textBox.innerHTML = "The surrounding leaves are too damp to use as kindling and you didn't buy anything to light a fire! Oh well, you'll probably be safe for just one night... right?" + textBox.innerHTML;
			}
		}
	},
	{ steps: 29, text: 'Success! With the fire lit you can now rest your head and sleep. Tomorrow will be another long day.' },
	{ steps: 30, text: 'You awake suddenly to a crippling pain. The hot, steaming breath of a wild bear draws closer from out of the pitch black and you feel a great claw tear deep into your chest, puncturing both lungs. This is the end…'},
]
//function for progressing through the story, adds 1 to the steps variable if called and displays the corresponding item from the 'story' array
	
function takeStep(listener){


	steps++;

	//first item in story array
	var storyBit = story[x];
	console.log(x);
	console.log(storyBit.steps);
	console.log(steps);
	var textBox = document.getElementById('textbox');
	//check if the number of steps is enough for the story piece to show
	if (steps >= storyBit.steps) {
	story.shift();
	shift++;
		
	textBox.innerHTML = "<p>" + storyBit.text + "</p>" + textBox.innerHTML;
	};
	if(storyBit.doSomething){
			storyBit.doSomething(listener);
		};

};
	

// SAVE/LOAD \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\



/*SAVE*/
/*money*/
document.getElementById('save-btn').addEventListener('click', function() {

	localStorage.clear();

	localStorage.setItem('cash', tradeResources.gold.amountOwned);

	/*items*/
	localStorage.setItem('shovelAmt', resource.shovel.amountOwned);
	localStorage.setItem('amuletAmt', resource.amulet.amountOwned);
	localStorage.setItem('luckPotionAmt', resource.luckPotion.amountOwned);
	localStorage.setItem('hpPotionAmt', resource.hpPotion.amountOwned);
	localStorage.setItem('repairKitAmt', resource.repairKit.amountOwned);
	localStorage.setItem('tinderBoxAmt', resource.tinderBox.amountOwned);

	/*hsteps*/
	localStorage.setItem('steps', steps);

	/*hp*/
	localStorage.setItem('hp', tradeResources.hp.amountOwned);

	/*action button contents*/

	localStorage.setItem('panelOne', document.getElementById('panel1').innerHTML);
	localStorage.setItem('panelTwo', document.getElementById('panel2').innerHTML);
	console.log(document.getElementById('panel2').innerHTML);
	localStorage.setItem('panelThree', document.getElementById('panel3').innerHTML);
	localStorage.setItem('panelFour', document.getElementById('panel4').innerHTML);


});

/*LOAD*/

document.getElementById('load-btn').addEventListener('click', function() {

	/*buildings*/
	var shovelLoad = localStorage.getItem('shovelAmt');
	var amuletLoad = localStorage.getItem('amuletAmt');
	var luckPotionLoad = localStorage.getItem('luckPotionAmt');
	var hpPotionLoad = localStorage.getItem('hpPotionAmt');
	var repairKitLoad = localStorage.getItem('repairKitAmt');
	var tinderBoxLoad = localStorage.getItem('tinderBoxAmt');

	shovelLoad = parseInt(shovelLoad);
	amuletLoad = parseInt(amuletLoad);
	luckPotionLoad = parseInt(luckPotionLoad);
	hpPotionLoad = parseInt(hpPotionLoad);
	repairKitLoad = parseInt(repairKitLoad);
	tinderBoxLoad = parseInt(tinderBoxLoad);

	localStorage.setItem('shovelAmt', resource.shovel.amountOwned);
	localStorage.setItem('amuletAmt', resource.amulet.amountOwned);
	localStorage.setItem('luckPotionAmt', resource.luckPotion.amountOwned);
	localStorage.setItem('hpPotionAmt', resource.hpPotion.amountOwned);
	localStorage.setItem('repairKitAmt', resource.repairKit.amountOwned);
	localStorage.setItem('tinderBoxAmt', resource.tinderBox.amountOwned);

	if (shovelLoad > 0){
	resource.shovel.amountOwned = shovelLoad;
	resource.shovel.addToInvent();
	}

	if (amuletLoad > 0){
	resource.amulet.amountOwned = amuletLoad;
	resource.amulet.addToInvent();
}
	if (luckPotionLoad > 0){
	resource.luckPotion.amountOwned = luckPotionLoad;
	resource.luckPotion.addToInvent();
}
	if (hpPotionLoad > 0){
	resource.hpPotion.amountOwned = hpPotionLoad;
	resource.hpPotion.addToInvent();
}
	if (repairKitLoad > 0){
	resource.repairKit.amountOwned = repairKitLoad;
	resource.repairKit.addToInvent();
}
	if (tinderBoxLoad > 0){
	resource.tinderBox.amountOwned = tinderBoxLoad;
	resource.tinderBox.addToInvent();
}

			/*cash*/
	var cashLoad = localStorage.getItem('cash');
	cashLoadNew = parseInt(cashLoad);
	tradeResources.gold.amountOwned = cashLoadNew;
	tradeResources.gold.updateAmountDisplay(cashLoadNew);
	
	var stepsLoad = localStorage.getItem('steps');
	stepsLoadNew = parseInt(stepsLoad);
	for (i = 0; i < shift; i++){
		if(shift < steps){							         //add dummy array elements to compensate for ones that were shifted out
		story.unshift(0);									
		} else {
			var unshifter = shift - steps;
			story.unshift(unshifter)
		}
	};
	for(var i = 0; i < stepsLoadNew; i++) {
	var storyBit = story[i];
	var textBox = document.getElementById('textbox');
	textBox.innerHTML = "<p>" + storyBit.text + "</p>" + textBox.innerHTML;
	}
	steps = stepsLoadNew;
	x = stepsLoadNew;

	


	var panelcontents1 = localStorage.getItem('panelOne');
	var panelcontents2 = localStorage.getItem('panelTwo');
	var panelcontents3 = localStorage.getItem('panelThree');
	var panelcontents4 = localStorage.getItem('panelFour');

	panel1.innerHTML = panelcontents1;
	panel2.innerHTML = panelcontents2;
	panel3.innerHTML = panelcontents3;
	panel4.innerHTML = panelcontents4;


});

	


