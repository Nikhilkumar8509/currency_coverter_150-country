const BASE_URL =
  "https://v6.exchangerate-api.com/v6/08d925fafb5d6d27adf48704/latest";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// ================= POPULATE DROPDOWNS =================
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;

    if (select.name === "from" && currCode === "USD") {
      newOption.selected = true;
    }
    if (select.name === "to" && currCode === "INR") {
      newOption.selected = true;
    }

    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

// ================= UPDATE FLAG =================
const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;

  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

// ================= UPDATE EXCHANGE RATE =================
const updateExchangeRate = async () => {
  try {
    let amount = document.querySelector(".amount input");
    let amtVal = Number(amount.value);

    if (amtVal < 1 || isNaN(amtVal)) {
      amtVal = 1;
      amount.value = "1";
    }

    // ✅ FROM currency ab dynamic hai
    const URL = `${BASE_URL}/${fromCurr.value}`;

    let response = await fetch(URL);   //api call hui
    let data = await response.json();   //api response mila

    // ✅ ExchangeRate-API ka correct path    conversion_rates API ke response ka part hai
//Ye humne khud nahi banaya, balki ExchangeRate-API server ne bheja hai.
    let rate = data.conversion_rates[toCurr.value];

    if (!rate) {
      msg.innerText = "❌ Currency not supported";
      return;
    }

    let finalAmount = (amtVal * rate);
    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
  } catch (error) {
    console.error(error);
    msg.innerText = "⚠️ Error fetching exchange rate";
  }
};


// ================= EVENTS =================
btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

window.addEventListener("load", () => {
  updateExchangeRate();
});
