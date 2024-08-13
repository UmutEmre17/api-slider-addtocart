document.addEventListener('DOMContentLoaded', () => {
    const productsContainer = document.querySelector('.products-container');
    const prevButton = document.querySelector('.prev-button');
    const nextButton = document.querySelector('.next-button');

    let products = [];
    let currentIndex = 0;
    let slideWidth = 0;

    //fetch data
    fetch('https://mocki.io/v1/6035ee03-6af9-4d39-ac58-1ba1646d1596')
        .then(response => response.json())
        .then(data => {
            products = data;
            renderProducts();
        })
        .catch(error => {
            console.error('Error fetching products:', error);
        });

    prevButton.addEventListener('click', () => {
        slidePrev();
    });

    nextButton.addEventListener('click', () => {
        slideNext();
    });

    function renderProducts() {
        products.forEach((product, index) => {
            const productHTML = `
                <div class="product" data-index="${index}">
                    <h2>${product.name}</h2>
                    <img src="${product.image}" alt="${product.name}">
                    <p class="old-price">Price: ${product.price} TL</p>
                    <p class="new-price">New Price: ${product.discounted_price} TL</p>
                    <button class="add-to-cart">Add to cart</button>
                </div>
            `;
            productsContainer.insertAdjacentHTML('beforeend', productHTML);
        });

        const productsElements = productsContainer.querySelectorAll('.product');
        // Calculate slide width including margins
        slideWidth = productsElements[0].offsetWidth + parseFloat(getComputedStyle(productsElements[0]).marginLeft) + parseFloat(getComputedStyle(productsElements[0]).marginRight);
        productsContainer.style.transform = `translateX(${currentIndex * -slideWidth}px)`;

        //event listeners for the add to cart buttons
        const addToCartButtons = document.querySelectorAll('.add-to-cart');
        addToCartButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const productElement = event.target.closest('.product');
                const productIndex = productElement.getAttribute('data-index');
                const product = products[productIndex];
                if (product) {
                    addToCart(product);
                } else {
                    console.error('Product not found');
                }
            });
        });
    }

    function slidePrev() {
        if (currentIndex > 0) {
            currentIndex--;
            productsContainer.style.transform = `translateX(${currentIndex * -slideWidth}px)`;
            productsContainer.style.transition = 'transform 0.5s ease-in-out';
        }
    }

    function slideNext() {
        if (currentIndex < products.length - 5.5) {
            currentIndex++;
            productsContainer.style.transform = `translateX(${(currentIndex * -slideWidth)+( slideWidth / 2.3)}px)`;
            productsContainer.style.transition = 'transform 0.5s ease-in-out';
        }
    }

    function addToCart(product) {
        let insCart = JSON.parse(localStorage.getItem('insCart')) || [];
        const existingProduct = insCart.find(p => p.id === product.id);

        if(existingProduct){
            existingProduct.quantity += 1;
        }else{
            product.quantity = 1;
            insCart.push(product);

        }
        
        localStorage.setItem('insCart', JSON.stringify(insCart));
        console.log(`Added id ${product.id}, name ${product.name} to cart`);
    }
});
