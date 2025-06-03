//set username and store in cookie
function setUsername() {
    const name = document.getElementById('username').value;
    document.cookie = `username${name}; path=/`;
    greetUser();

}

//Retrive cookie by name
function getCookie(name){
    const value = `; ${document.cookie}`;
    const parts =value.split(`; ${name}=`);
    if (parts.length === 2)
        return parts.pop().split(';').shift();
    
}

//greet user using stored cookie
function greetUser() {
    const name = getCookie('userName');
    if (name) {
        document.getElementById('greeting').innerText = `welcome back, ${name}!`;


    }
}


// save selected font to session storage
function setFontpreference() {
    const font = document.getElementById('fontSelector').value
    sessionStorage.setItem('font', font);
    document.body.style.fontFamily = font;


}

//apply font preference on page load
function applyFontPreference() {
    const font = sessionStorage.getItem('font');
    if (font) document.body.style.fontFamily =font;
    
}


// Save cart prefrences to cookies
function setCartPreference(){
    const currency = document.getElementById('currencySelector').value;
    const shipping =document.getElementById('shippingSelector').value;
    document.cookie = `currency=${currency}; path=/`;
    document.cookie = `shipping=${shipping}; path=/`; 
}


// Load cart preference from cookies
function loadCartPrefrence() {
    const currency = getCookie('currency') || '$';
    const shipping = getCookie('shipping') || 'Standard';
    document.getElementById('currencyDisplay').innerText = currency;
    document.getElementById('shippingDisplay').innerText = shipping;
}

//add a product to the cart and update localStorage
function addToCart(name, price) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push({name, price});
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();

}

//update the cart display from local storage
function updateCartDisplay() {
    const cart = JSON.parse(localStorage.getItem('cart')) ||[];
    const cartItemsDiv = document.getElementById('cartItems');
    const totalPriceSpan = document.getElementById('totalPrice');

    if (cart.length === 0) {
        cartItemsDiv.innerHTML = 'Your cart is empty.';
        totalPriceSpan.innerText ='0';
        return;
    }

    cartItemsDiv.innerHTML = '';
    let total = 0;
    cart.forEach((item, index) => {
        //create item display and remove button
        const itemDiv = document.createElement('div');
        itemDiv.textContent = `${item.name} - $${item.price}`;
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';

        //onclick, remove item from cart and update localStorage
        removeBtn.onclick = () => {
            cart.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartDisplay();
            
        };
        itemDiv.appendChild(removeBtn);
        cartItemsDiv.appendChild(itemDiv);
        total += item.price;
    });
    totalPriceSpan.innerText = total;
    
}

//clear the cart and update the display
function clearCart() {
    localStorage.removeItem('cart');
    updateCartDisplay();
}

//rest all storage and cookies, and reload page
function resetPreferences() {
    localStorage.clear();
    document.cookie = "username=;expires=thurs, 01  Feb 1970 00:00:00 UCT; path=/;"; 
    document.cookie = "currency=; expires=thurs 01 Feb 1970 00:00:00 UCT; path=/;";
    document.cookie = "shipping=; expires=thurs 01 Feb 1970 00:00:00 UCT; path=/;";
    location.reload();

}


// Register service worker for catchingstatic resources
if ('serviceWorker'in navigator) {
    window.addEventListener('load', () =>{
        navigator.serviceWorker.register('/sw.js')
        .then(reg => console.log('Service Worker registered:', reg))
        .cach(err => console.error('Service Worker registration failed:',err));
    });

}

//on page load , intialize greeting, font and cart display 
window.onload = () => {
    greetUser();
    applyFontPreference();
    loadCartPrefrence();
    updateCartDisplay();
};