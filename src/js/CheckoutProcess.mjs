import ExternalServices from "./ExternalServices.mjs";
import { getLocalStorage } from "./utils.mjs";

// takes the items currently stored in the cart (localstorage) and returns them in a simplified form.
const services = new ExternalServices;
// takes a form element and returns an object where the key is the "name" of the form input.
function formDataToJSON(formElement) {
    const formData = new FormData(formElement),
      convertedJSON = {};
  
    formData.forEach(function (value, key) {
      convertedJSON[key] = value;
    });
  
    return convertedJSON;
}

function packageItems(items) {
    // convert the list of products from localStorage to the simpler form required for the checkout process. Array.map would be perfect for this.
    
    let exportItemList = items.map ((item) => {
        
        return{ 
            id:item.Id,
            name:item.Name,
            price:item.FinalPrice * item.Qty,
            quantity:item.Qty
         }
    })  
    return exportItemList; 
}
   

export default class CheckoutProcess {
    constructor(key, outputSelector) {
      this.key = key;
      this.outputSelector = outputSelector;
      this.list = [];
      this.itemTotal = 0;
      this.shipping = 0;
      this.tax = 0;
      this.orderTotal = 0;
      this.quantity = 0;
    }
    init() {
      this.list = getLocalStorage(this.key);
      this.calculateItemSummary();
      this.calculateOrdertotal();
      
    }
    calculateItemSummary() {
        // calculate and display the total amount of the items in the cart, and the number of items.
        
        for (let i = 0; i < this.list.length; i++) {
            this.itemTotal += parseFloat(this.list[i].FinalPrice * this.list[i].Qty);
            this.quantity += parseInt(this.list[i].Qty);           
          }
          
    }
    calculateOrdertotal() {
        // calculate the shipping and tax amounts. Then use them to along with the cart total to figure out the order total
        this.tax = (this.itemTotal * 0.06);
        this.shipping = (10 + ((this.quantity - 1) * 2));
        this.orderTotal = this.itemTotal + this.tax + this.shipping;
        // display the totals.
        this.displayOrderTotals();
    }
    displayOrderTotals() {
        // once the totals are all calculated display them in the order summary page
        let orderSummary = document.querySelector(".order-details");
        
        orderSummary.innerHTML = `
        <div><p>Item Subtotal (${this.quantity}) $${this.itemTotal.toFixed(2)}</p>
        <p>Tax $${this.tax.toFixed(2)}</p>
        <p>Shipping Estimate $${this.shipping.toFixed(2)}</p>
        <p><strong>Order Total $${this.orderTotal.toFixed(2)}</strong></p>
        <div/>`;
        localStorage.setItem("so-ss", 0);

        
    }
    async checkout() {
        console.log("test")
        // build the data object from the calculated fields, the items in the cart, and the information entered into the form
        const formElement = document.forms["checkout"];

        const json = formDataToJSON(formElement);
        // add totals, and item details
        json.orderDate = new Date();
        json.orderTotal = this.orderTotal;
        json.tax = this.tax;
        json.shipping = this.shipping;
        json.items = packageItems(this.list);
        console.log(json);
        try {
        const res = await services.checkout(json);
        console.log(res);
        } catch (err) {
        console.log(err);
        }
    }
        
       
        // call the checkout method in our ExternalServices module and send it our data object.
    
}


 


