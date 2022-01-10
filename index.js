'use strict';
const mapEL = document.querySelector(`#map`);
const ipdetails = document.querySelector(`.ip--details`);
const allInfos = document.querySelectorAll(`.info`);
const searchBtn = document.querySelector(`.search--btn`);
const searchBar = document.querySelector(`.input--ip-address`);
const loader = document.querySelector(`.loader`);
const detailsBlock = document.querySelector(`.details`);
const errorInfo = document.querySelector(`.error--info`);
const infoLoaders = document.querySelectorAll(`.info--loader`);

const iconLocation = L.icon({
    iconUrl: 'C:\Users\Reliance\Desktop\Ip_Address_Tracker-main\images\icon-location.svg',
    iconSize: [30, 40]
})

let map;

const iconLoader = function(location) {
    L.marker(location, {icon: iconLocation})
    .addTo(map)
}

const mapLoader = function(location) {
    map = L.map('map').setView(location, 13);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
    .addTo(map);
    iconLoader(location);
}

const getIpAddress = async function(userInput = ``) {
    try {
        let fetchedData;
        const checkDomainRegex = /https:|www|.com/gi;
        const isDomain = userInput.search(checkDomainRegex);

        if(isDomain < 0) fetchedData = await fetch(`https://geo.ipify.org/api/v1?apiKey=at_ipzjlV2A3Z9bPVqxPO1v8xUrITfzD&ipAddress=${userInput}`);
        if(isDomain >= 0) fetchedData = await fetch(`https://geo.ipify.org/api/v1?apiKey=at_ipzjlV2A3Z9bPVqxPO1v8xUrITfzD&domain=${userInput}`);
        if(!userInput) fetchedData = await fetch(`https://geo.ipify.org/api/v1?apiKey=at_ipzjlV2A3Z9bPVqxPO1v8xUrITfzD`);
        if(!fetchedData.ok) {
            throw new Error(`Enter a valid Domain or IP`);
        }

        const userData = await fetchedData.json();

        const {lat, lng, city, country, postalCode, timezone} = userData.location;
        const location = [lat, lng];
        const userInfoArr = [userData.ip, `${country}, ${city} ${postalCode}`, `UTC ${timezone}`, userData.isp];

        allInfos.forEach((info, i) => {
            infoLoaders[i].style.display = 'none'
            info.innerText = userInfoArr[i];
        });
        ipdetails.style.display = 'flex';
        loader.style.display = 'none';
        mapEL.style.display = 'block';
        errorInfo.style.display = 'none'
        if(!userInput) mapLoader(location);
        if(userInput) {
            iconLoader(location);
            map.setView(location, 13, {
                animate: true,
                pan: {
                    duration: 1,
                }}
            )
        }
    } catch(err) {
        ipdetails.style.display = 'none'
        errorInfo.style.display = 'block';
        errorInfo.innerHTML = `<p>${err.message}</p>`;
        mapEL.style.display = 'none'
    }
}
getIpAddress();
searchBtn.addEventListener(`click`, (e) => {
    e.preventDefault();
    const searchInput = searchBar.value;
    if(!searchInput) return;
    searchBar.value = ``;
    errorInfo.style.display = 'none'
    loader.style.display = 'flex';
    mapEL.style.display = 'none';
    ipdetails.style.display = 'flex'
    infoLoaders.forEach((load, i) => {
        load.style.display = `inline-block`
        allInfos[i].textContent = ``;
    });
    getIpAddress(searchInput);
})