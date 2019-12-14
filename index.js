const cities = require('./iller.json')
const centroids = require('./iller-orta.json')
const config = require('./config')
const mainContainer = document.querySelector('#turkey-svg-cities-continer');
const map = document.querySelector('#turkey-svg-cities-continer .map-container .map')
// const mapHeader = document.querySelector('#turkey-svg-cities-continer .map-container .map-header .map-header-total-mosque-count')
const totalPeopleCountDom = document.querySelector('#turkey-svg-cities-continer .map-container .map-header .map-header-total-people-count')
const menu = document.querySelector('#turkey-svg-cities-continer .map-menu')
const link = 'http://a.haydicocuklarcamiye.com/camiler/?sid='
const city = menu.querySelector('.map-menu-city')
// const categoryA = menu.querySelector('.map-menu-category.a')
// const categoryB = menu.querySelector('.map-menu-category.b')
// const categoryC = menu.querySelector('.map-menu-category.c')
// const categoryTotal = menu.querySelector('.map-menu-category-total')
// const countOfMosque = menu.querySelector('.map-menu-mosque-count')
const mapMenuItemContainer = mainContainer.querySelector('.map-menu-item-container')
const mapMenuItems = Array.from(mapMenuItemContainer.querySelectorAll('.map-menu-item'))
const categories = Array.from(document.querySelectorAll('#turkey-svg-cities-continer .category-container .category'));


// const colors = ['#2C7AA0', '#3B8BB4', '#4C9DC5', '#5FADD4', '#6BBAE2', '#78C6ED', '#89D2F6']
// const colors = ['#2C7AA0', '#3B8BB4', '#5FADD4', '#6BBAE2', '#89D2F6']
// const colors = ['#145471', '#2C7AA0', '#3B8BB4', '#5FADD4', '#6BBAE2', '#89D2F6', '#9CDDFD']
// const colors = ['#0C4054', '#145471', '#2C7AA0', '#5FADD4', '#89D2F6', '#9CDDFD', '#B1E6FF']
const colors = ['#0C4054', '#145471', '#2C7AA0', '#5FADD4', '#89D2F6', '#9CDDFD', '#B1E6FF'].reverse()

const getColor = function (val, maxValue) {
    // console.log
    const ratio = Math.round((val / maxValue) * (colors.length - 1));
    // console.log('rat', ratio)
    return colors[ratio];
}
const loadSvg = function (data, dataKey) {
    // console.log('data', data)
    // console.log('loadSvg', dataKey)
    const xSpace = 1420;
    const ySpace = 2590;
    let pointArray = '';
    let totalDataKeyCount = 0;
    // let totalPeopleCount = 0;

    const maxValue = Object.keys(data).reduce((a, b) => {
        if (data[b][dataKey] > a) {
            return data[b][dataKey];
        }
        return a;
    }, 0);
    // console.log('maxValue', maxValue);
    for (const index in cities.features) {
        const feature = cities.features[index]
        const code = centroids.features[index].properties.ILKOD
        const name = centroids.features[index].properties.NAME
        let [x, y] = centroids.features[index].geometry.coordinates
        x = parseInt((x / 2000) - xSpace)
        y = parseInt(ySpace - (y / 2000))
        const dataKeyValue = data[code][dataKey];
        // console.log('dataKeyValue, maxValue', dataKeyValue, maxValue)
        const color = getColor(dataKeyValue, maxValue)
        pointArray += `<g fill="${color}">`
        for (const polygon of feature.geometry.coordinates) {
            let points = ''
            for (const [_x, _y] of polygon[0]) {
                points += `${parseInt((_x / 2000) - xSpace)},${parseInt(ySpace - (_y / 2000))} `
            }
            pointArray += `<polygon points="${points}"/>`
        }
        if (data[code] && data[code][dataKey]) {
            totalDataKeyCount += data[code][dataKey]
        }
        // let totalPeople = data[code] ? data[code].a + data[code].b + data[code].c : '-'
        // let totalPeople = data[code] ? data[code].a + data[code].b : '-'
        // if (totalPeople > 0) {
        //     totalPeopleCount += totalPeople
        // }
        // totalPeople = 'aaaa'

        pointArray += `
        <text x="${x}" y="${y}" fill="white">
            <tspan text-anchor="middle">${dataKeyValue}</tspan>
            </text>
            <desc>${data[code] ? JSON.stringify({ ...data[code], name, success: true, code }) : JSON.stringify({ name, code })}</desc>
        </g>`
    }
    if (!isNaN(totalDataKeyCount)) {
        // mapHeader.innerHTML = 'Cami Sayısı: ' + 'totalMosqueCount'
        const activeTab = categories.find(a => a.dataset.type === dataKey)
        if(activeTab) {
            totalPeopleCountDom.innerHTML = activeTab.innerHTML + ' : ' + totalDataKeyCount
        } else {
            totalPeopleCountDom.innerHTML = 'Toplam : ' + totalDataKeyCount
        }
    }
    let svg = `
    <svg viewBox="0 0 1080 460" class="svg" width="100%">
    ${pointArray}
    </svg>
    `
    map.innerHTML = svg
    let selectedData = undefined
    const citiesPolygons = map.querySelectorAll('svg g')
    const onEnter = function () {
        menu.style.opacity = 1
        selectedData = this.querySelector('desc')
        if (selectedData.innerHTML && JSON.parse(selectedData.innerHTML).success) {
            const cityData = JSON.parse(selectedData.innerHTML)
            city.innerHTML = cityData.name;
            for (const menuItem of mapMenuItems) {
                menuItem.querySelector('.value').innerHTML = cityData[menuItem.dataset.type]
            }
        } else {
            city.innerHTML = JSON.parse(selectedData.innerHTML).name
            if (categoryA) categoryA.innerHTML = 0;
            if (categoryB) categoryB.innerHTML = 0;
            if (categoryC) categoryC.innerHTML = 0;
            if (categoryTotal) categoryTotal.innerHTML = 0;
            if (countOfMosque) countOfMosque.innerHTML = 0;
        }
    }
    const onLeave = function () {
        menu.style.opacity = 0.0
    }
    const onMove = function (event, isMobile) {
        if (isMobile) {
            if ((window.innerWidth / 2) > event.touches[0].clientX) {
                menu.style.left = event.touches[0].clientX + 20
                menu.style.top = event.touches[0].clientY
                menu.style.right = 'auto'
            } else {
                menu.style.right = window.innerWidth - event.touches[0].clientX + 20
                menu.style.top = event.touches[0].clientY
                menu.style.left = 'auto'
            }
            menu.style.pointerEvents = 'all'
            return
        }
        if ((window.innerWidth / 2) > event.clientX) {
            menu.style.left = event.clientX + 20
            menu.style.top = event.clientY
            menu.style.right = 'auto'
        } else {
            menu.style.right = window.innerWidth - event.clientX + 20
            menu.style.top = event.clientY
            menu.style.left = 'auto'
        }

    }
    const onClick = function () {
        const data = this.querySelector('desc')
        const code = JSON.parse(data.innerHTML).code
        location = link + code
    }
    const showOnWebSiteButton = document.querySelector('.map-menu .map-menu-show-on-web-site')
    showOnWebSiteButton.addEventListener('click', function (event) {
        // console.log('selectedData', selectedData)
        const code = JSON.parse(selectedData.innerHTML).code
        location = link + code
    })
    const onTouch = function (event) {
        showOnWebSiteButton.style.display = 'flex'
        event.preventDefault()
        event.stopPropagation()
        onEnter.bind(this, event)()
        onMove.bind(this, event, true)()
    }
    citiesPolygons.forEach(city => {
        city.addEventListener('touchstart', onTouch)
        city.addEventListener('click', onClick)
        city.addEventListener('mouseenter', onEnter)
        city.addEventListener('mouseleave', onLeave)
        city.addEventListener('mousemove', onMove)
    })
}


const dataPromise = fetch(config.url).then(x => x.json());
dataPromise.then(data => {
    const activeOne = categories.find(a => a.classList.contains('active'))
    if (activeOne) {
        loadSvg(data, activeOne.dataset.type)
    } else {
        loadSvg(data, 'sayi')
    }
})
const categoryClick = function (event) {
    const activeOne = categories.find(a => a.classList.contains('active'))
    if (activeOne === this) {
        // console.log('AYNI')
        return;
    }
    activeOne.classList.toggle('active');
    this.classList.toggle('active');
    dataPromise.then(data => {
        loadSvg(data, this.dataset.type);
    })
}
categories.forEach(cat => {
    cat.addEventListener('click', categoryClick)
})
