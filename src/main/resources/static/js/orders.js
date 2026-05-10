let myOrders=JSON.parse(localStorage.getItem("myOrdersList"))||[];
let currentReviewOrderId=null;
let currentRating=0;

document.addEventListener("DOMContentLoaded",()=>{

renderOrders();

setupStars();
});

function renderOrders(){

const list=document.getElementById("ordersList");

if(!list)return;

if(myOrders.length===0){

list.innerHTML="<p>You have no past orders.</p>";

return;
}

let html="";

myOrders.forEach(order=>{

const btnClass=order.isReviewed?"review-btn done":"review-btn";

const btnText=order.isReviewed?"Reviewed ✓":"Leave a Review";

const btnAction=order.isReviewed?"":`onclick="openReviewModal('${order.id}','${order.restaurantName}')"`;


html+=`

<div class="order-card">

<div class="order-info">

<h4>
${order.restaurantName||"-"}
</h4>

<p>
<strong>Order ID:</strong>
${order.id||"-"}
</p>

<p>
<strong>Date:</strong>
${order.date||"-"}
</p>

<p>
<strong>Items:</strong>
${order.items||"-"}
</p>

<p>
<strong>Receiver Name:</strong>
${order.receiverName||"-"}
</p>

<p>
<strong>Receiver Phone:</strong>
${order.receiverPhone||"-"}
</p>

<p>
<strong>Address:</strong>
${order.address||"-"}
</p>

<span class="order-status">
${order.status||"Pending"}
</span>

</div>

<div class="order-actions">

<div class="order-total">

$${order.total?order.total.toFixed(2):"0.00"}

</div>

<button
class="${btnClass}"
${btnAction}>
${btnText}

<button class="received-btn"
onclick="completeOrder('${order.id}')">
Order Received
</button>

</div>

</div>

`;
});

list.innerHTML=html;
}

function openReviewModal(orderId,resName){

currentReviewOrderId=orderId;

currentRating=0;

document.getElementById("reviewResName").innerText=`Review: ${resName}`;

document.getElementById("reviewComment").value="";

resetStars();

document.getElementById("ratingText").innerText="Select stars";

const reviewModal=document.getElementById("reviewModal");

reviewModal.style.display="flex";
}

function closeReviewModal(){

const reviewModal=document.getElementById("reviewModal");

reviewModal.style.display="none";
}

function setupStars(){

const stars=document.querySelectorAll(".review-stars i");

const texts=[
"Terrible",
"Bad",
"Okay",
"Good",
"Excellent"
];

if(stars.length===0)return;

stars.forEach(star=>{

star.addEventListener("mouseover",function(){

const val=parseInt(this.getAttribute("data-value"));

stars.forEach((s,index)=>{

s.classList.toggle(
"hovered",
index<val
);

});

document.getElementById(
"ratingText"
).innerText=texts[val-1];
});

star.addEventListener("mouseout",function(){

stars.forEach(s=>{

s.classList.remove("hovered");

});

document.getElementById(
"ratingText"
).innerText=
currentRating===0
?"Select stars"
:texts[currentRating-1];
});

star.addEventListener("click",function(){

currentRating=parseInt(
this.getAttribute("data-value")
);

stars.forEach((s,index)=>{

if(index<currentRating){

s.classList.add(
"active"
);

s.classList.add(
"fas"
);

s.classList.remove(
"far"
);

}else{

s.classList.remove(
"active"
);

s.classList.remove(
"fas"
);

s.classList.add(
"far"
);
}
});
});
});
}

function resetStars(){

document.querySelectorAll(
".review-stars i"
).forEach(s=>{

s.classList.remove(
"active"
);

s.classList.remove(
"hovered"
);

s.classList.remove(
"fas"
);

s.classList.add(
"far"
);
});
}

function submitReview(){

if(currentRating===0){

alert(
"Please select a star rating!"
);

return;
}

const orderIndex=
myOrders.findIndex(
o=>o.id===currentReviewOrderId
);

if(orderIndex!==-1){

myOrders[orderIndex].isReviewed=true;

localStorage.setItem(
"myOrdersList",
JSON.stringify(myOrders)
);
}

alert(
"Review submitted!"
);

closeReviewModal();

renderOrders();
}

function completeOrder(orderId){

    const confirmDelete=
        confirm(
            "Are you sure you received this order?"
        );

    if(!confirmDelete){
        return;
    }

    myOrders=
        myOrders.filter(
            order=>order.id!==orderId
        );

    localStorage.setItem(
        "myOrdersList",
        JSON.stringify(myOrders)
    );

    renderOrders();
}