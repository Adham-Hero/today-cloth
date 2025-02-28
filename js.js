let selectedGender = "male";

function getWeatherByLocation(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m`;

    fetch(url)
        .then(response => response.json())
        .then(data => updateUI(data))
        .catch(error => console.error("⚠️ خطأ في جلب البيانات:", error));
}

function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                getWeatherByLocation(lat, lon);
            },
            (error) => {
                console.error("⚠️ لم يتم السماح بالوصول إلى الموقع:", error);
                alert("⚠️ يجب السماح بالوصول إلى الموقع للحصول على الطقس.");
            }
        );
    } else {
        alert("⚠️ المتصفح لا يدعم تحديد الموقع الجغرافي.");
    }
}

function updateUI(data) {
    if (!data || !data.hourly || !data.hourly.temperature_2m) {
        console.error("⚠️ البيانات غير متاحة أو بها خطأ.");
        document.querySelector(".hr-num").innerText = "غير متاح";
        return;
    }

    const temp = Math.round(data.hourly.temperature_2m[0]);
    document.querySelector(".hr-num").innerText = `${temp}°C`;

    updateBackground(temp);
    updateClothes(temp);
}

function updateBackground(temp) {
    const body = document.body;

    if (temp <= 5) {
        body.style.backgroundImage = "url('img/متجمد.webp')";
    } else if (temp > 5 && temp <= 15) {
        body.style.backgroundImage = "url('img/بارد.webp')";
    } else if (temp > 15 && temp <= 25) {
        body.style.backgroundImage = "url('img/معتدل.webp')";
    } else {
        body.style.backgroundImage = "url('img/حار.webp')";
    }
}

function updateClothes(temp) {
    const clothContainer = document.querySelector(".cloth-box");
    clothContainer.innerHTML = "";

    let maleClothing = {
        0: ["hat", "gloves", "scarf", "hody", "jaket"],
        5: ["hody", "jaket", "gloves"],
        15: ["jaket", "bolover"],
        20: ["bolover", "shirt"],
        100: ["shirt"]
    };

    let femaleClothing = {
        0: ["hat", "gloves", "scarf", "coat", "sweater"],
        5: ["coat", "sweater", "gloves"],
        15: ["jacket", "sweater"],
        20: ["sweater", "blouse"],
        100: ["blouse"]
    };

    let clothingItems = selectedGender === "male" ? maleClothing : femaleClothing;
    let selectedClothes = [];

    for (let key in clothingItems) {
        if (temp <= key) {
            selectedClothes = clothingItems[key];
            break;
        }
    }

    selectedClothes.forEach((clothingType) => {
        let clothDiv = document.createElement("div");
        clothDiv.className = `cloth-item cloth-item-${clothingType}`;

        let img = document.createElement("img");
        img.src = `img/${selectedGender}/${clothingType}.png`;
        img.width = 100;
        img.height = 100;
        img.alt = clothingType;

        let clothName = document.createElement("div");
        clothName.className = "cloth-name";
        clothName.innerText = clothingType;

        clothDiv.appendChild(img);
        clothDiv.appendChild(clothName);
        clothContainer.appendChild(clothDiv);
    });
}

document.querySelector(".male").addEventListener("click", () => {
    selectedGender = "male";
    updateClothes(parseInt(document.querySelector(".hr-num").innerText));
});

document.querySelector(".female").addEventListener("click", () => {
    selectedGender = "female";
    updateClothes(parseInt(document.querySelector(".hr-num").innerText));
});

getUserLocation();
