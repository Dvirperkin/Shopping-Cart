(function() {

    let quantity = 0
    let summary = 0

    fetch("/products")
        .then(status)
        .then(json)
        .then((res) => {
            let quantityElement = document.getElementById("Quantity")
            let summaryElement = document.getElementById("productSummary")


            let productsList = document.getElementById("Products")
            res.forEach( product => {
                quantity += 1
                summary += product.price * product.quantity

                let li = document.createElement("li")
                li.innerHTML = `<h5>${product.title}</h5>`
                li.innerHTML += `<p>${product.description}</p>`
                li.innerHTML += `<p>${product.price}$</p>`


                let img = document.createElement("img")
                img.setAttribute("src", product.image)
                img.setAttribute("class", "w-25")

                let productQuantity = document.createElement("div")


                let plusBtn = createPlusBtn(product, productQuantity, summaryElement, quantityElement)

                productQuantity.innerText = product.quantity

                let minusBtn = createMinusBtn(product, productQuantity, summaryElement, quantityElement)

                let delBtn = createDelBtn(product, productQuantity, summaryElement, quantityElement)


                li.appendChild(img)
                li.appendChild(document.createElement("br"))
                li.appendChild(plusBtn)
                li.appendChild(productQuantity)
                li.appendChild(minusBtn)
                li.appendChild(document.createElement("br"))
                li.appendChild(delBtn)

                productsList.appendChild(li)
            })

            setShipmentValue()
            quantityElement.innerText = `Quantity: ${quantity}`
            summaryElement.innerText = `Products Price: ${summary.toFixed(2)}$`
        }).catch(err => {
            console.log(err)
    })

    function setShipmentValue(){
        let shippingValue = document.getElementById("shippingValue")
        if(quantity > 4){
            shippingValue.innerText = `Shipment Value: ${50 + (quantity - 4) * 5}$`
        } else {
            shippingValue.innerText = "Shipment Value: 50"
        }
    }

    function createDelBtn(product, productQuantity, summaryElement, quantityElement){
        let delBtn = document.createElement("button")
        delBtn.innerText = "Delete"
        delBtn.setAttribute("class", "bg-danger")

        delBtn.addEventListener("click", async (e) => {
            if(product.quantity !== 0) {
                quantity -= product.quantity
                setShipmentValue()
                summary -= product.price * product.quantity
            }

            quantityElement.innerText = `Quantity: ${quantity}`
            summaryElement.innerText = `Products Price: ${summary.toFixed(2)}`
            await fetch(`/del${product.id}`, {method: "delete"})
            e.target.parentNode.parentNode.removeChild(e.target.parentNode)
        })

        return delBtn
    }

    function createPlusBtn(product, productQuantity, summaryElement, quantityElement){
        let btnPlus = document.createElement("button")
        btnPlus.innerText = '+'
        btnPlus.addEventListener("click", async (e) => {
            await fetch(`/more${product.id}`, {method: "put"})
            productQuantity.innerText = (product.quantity += 1).toString()
            quantity += 1
            setShipmentValue()
            quantityElement.innerText = `Quantity: ${quantity}`
            summary += product.price
            summaryElement.innerText = `Products Price: ${summary.toFixed(2)}`
        })
        return btnPlus
    }

    function createMinusBtn(product, productQuantity, summaryElement, quantityElement){
        let btnMinus = document.createElement("button")
        btnMinus.innerText = '-'
        btnMinus.addEventListener("click", async (e) => {
            if(product.quantity === 0)
                return
            await fetch(`/less${product.id}`, {method: "put"})
            productQuantity.innerText = (product.quantity -= 1).toString()
            quantity -= 1
            setShipmentValue()
            quantityElement.innerText = `Quantity: ${quantity}`
            summary -= product.price
            summaryElement.innerText = `Products Price: ${summary.toFixed(2)}`
        })
        return btnMinus
    }

    //Checks response status code.
    function status(res) {
        if (res.status >= 200 && res.status <= 300) {
            return Promise.resolve(res);
        } else {
            return  Promise.reject(res.statusText);
        }
    }
    //Casting the promise to json.
    function json(res){
        return res.json();
    }

}());
