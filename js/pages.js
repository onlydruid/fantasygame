// show the given page selected from the navbar
function show(elementID) {
    // find the requested element, if element doesn't exist "if (!ele)" then show javascript alert "Page under maintenence"
    var ele = document.getElementById(elementID);
    if (!ele) {
        alert("Error, please reload ElfenTrail");
        return;
    }

    /* get all pages with the common class 'page', this includes the cart page as well as all the navbar items loop through them and hide them*/
    var pages = document.getElementsByClassName('page');
    for(var i = 0; i < pages.length; i++) {
        pages[i].style.display = 'none';
    }

    // here the requested element, the 'page', is formatted so the style is the same for all 'pages'
	ele.style.display = "inline-block";
    ele.style.position = 'absolute';
	ele.style.width = '100vw';
    ele.style.textAlign = 'center';
}