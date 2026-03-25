const button = document.getElementById("click-button");
const boneCount = document.getElementById("bone-count");
const cpsLabel = document.getElementById("cps-label");
const shopContainer = document.getElementById("shop-container");
const ownedList = document.getElementById("owned-list");
const statBones = document.getElementById("stat-bones");
const statPerClick = document.getElementById("stat-perclick");
const statCps = document.getElementById("stat-cps");

let totalBones = 0;
let itemsOwned = [];

const shopItems = [
  {
    name: "Puppy",
    description: "A little pup that finds bones for you.",
    cost: 10,
    startingCost: 10,
    bonesPerSec: 1,
    clickBonus: 0,
  },
  {
    name: "Treat Bag",
    description: "Doubles the bones you get per click.",
    cost: 50,
    startingCost: 50,
    bonesPerSec: 0,
    clickBonus: 0,
    isMultiplier: true,
  },
  {
    name: "Golden Retriever",
    description: "A very good boy. Earns 5 bones/sec.",
    cost: 150,
    startingCost: 150,
    bonesPerSec: 5,
    clickBonus: 0,
  },
  {
    name: "Dog Park",
    description: "A whole park of dogs! 20 bones/sec.",
    cost: 700,
    startingCost: 700,
    bonesPerSec: 20,
    clickBonus: 0,
  },
];

function getClickPower() {
  const multiplierItem = itemsOwned.find(i => i.name === "Treat Bag");
  const multiplierCount = multiplierItem ? multiplierItem.amount : 0;
  return 1 * (2 ** multiplierCount);
}

function getBonesPerSec() {
  let total = 0;
  for (let owned of itemsOwned) {
    const shopItem = shopItems.find(i => i.name === owned.name);
    if (shopItem) {
      total += shopItem.bonesPerSec * owned.amount;
    }
  }
  return total;
}

function buttonClick() {
  const gained = getClickPower();
  totalBones += gained;
  updateDisplay();
}

function updateDisplay() {
  boneCount.textContent = Math.floor(totalBones);
  statBones.textContent = Math.floor(totalBones);
  statPerClick.textContent = getClickPower();
  const cps = getBonesPerSec();
  statCps.textContent = cps;
  cpsLabel.textContent = cps + " bones / sec";
  updateOwnedList();
}

function updateOwnedList() {
  if (itemsOwned.length === 0) {
    ownedList.innerHTML = "<p>Nothing yet!</p>";
    return;
  }
  ownedList.innerHTML = "";
  for (let owned of itemsOwned) {
    const p = document.createElement("p");
    p.textContent = owned.name + ": " + owned.amount;
    ownedList.appendChild(p);
  }
}

function buyItem(itemName) {
  const item = shopItems.find(i => i.name === itemName);

  if (totalBones >= item.cost) {
    totalBones -= item.cost;

    let amount = 1;
    const alreadyOwned = itemsOwned.find(obj => obj.name === item.name);
    if (alreadyOwned) {
      alreadyOwned.amount++;
      amount = alreadyOwned.amount;
    } else {
      itemsOwned.push({ name: item.name, amount: 1 });
    }

    item.cost = item.startingCost + item.startingCost * amount ** 2;

    updateDisplay();
    createShopItems();
  } else {
    alert("Not enough bones! Need " + item.cost + " 🦴");
  }
}

function createShopItems() {
  document.querySelectorAll(".shop-item").forEach(el => el.remove());

  shopItems.forEach(item => {
    const div = document.createElement("div");
    div.className = "shop-item";

    div.innerHTML = `
      <div>
        <h3>${item.name}</h3>
        <p>${item.description}</p>
      </div>
      <button onclick="buyItem('${item.name}')">
        Buy 🦴${item.cost}
      </button>
    `;

    shopContainer.appendChild(div);
  });
}


setInterval(() => {
  const bps = getBonesPerSec();
  if (bps > 0) {
    totalBones += bps;
    updateDisplay();
  }
}, 1000);

button.addEventListener("click", function () {
  buttonClick();
});

createShopItems();
updateDisplay();