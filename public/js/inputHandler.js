const socket = io('http://localhost:3000');
const Name = document.querySelector('.product-name');
const Price = document.querySelector('.product-price');
const productImg = document.querySelector('#product-img');
const loader = document.querySelector('.loader-wrapper');

let numericPrice;
var productDetails = {};


socket.emit('get-product-details');

socket.on('product-details',(productData) =>{

    stopLoader();
    console.log('request received')
    console.log(productData)
    Name.innerText = productData.productName;
    Price.innerText = productData.productPrice;
    productImg.src = productData['img-src'];
    numericPrice = productData.productPrice.split('₹')[1].trim();
    numericPrice = numericPrice.split('.')[0].trim();
    numericPrice = Number(numericPrice.replace(/[^0-9.]/g, ""));
    console.log(numericPrice);
})

function stopLoader(){
    loader.style.trasition = 'ease-out' + ' 0.3s';
    loader.style.visibility = 'hidden';
}

