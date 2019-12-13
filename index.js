const cities = require('./iller.json')
const centroids = require('./iller-orta.json')
const config = require('./config')
const map = document.querySelector('#turkey-svg-cities-continer .map-container .map')
const mapHeader = document.querySelector('#turkey-svg-cities-continer .map-container .map-header .map-header-total-mosque-count')
const totalPeopleCountDom = document.querySelector('#turkey-svg-cities-continer .map-container .map-header .map-header-total-people-count')
const menu = document.querySelector('#turkey-svg-cities-continer .map-menu')
const link = 'http://a.haydicocuklarcamiye.com/camiler/?sid='
const city = menu.querySelector('.map-menu-city')
const categoryA = menu.querySelector('.map-menu-category.a')
const categoryB = menu.querySelector('.map-menu-category.b')
const categoryC = menu.querySelector('.map-menu-category.c')
const categoryTotal = menu.querySelector('.map-menu-category-total')
const countOfMosque = menu.querySelector('.map-menu-mosque-count')
// [ 2857405, 4275017 ], [ 2857405, 5175729 ], [ 4989109, 5175729 ], [ 4989109, 4275017 ], [ 2857405, 4275017 ] //bbox
const loadSvg = function (data) {
    const xSpace = 1420
    const ySpace = 2590
    let pointArray = ''
    let totalMosqueCount = 0
    let totalPeopleCount = 0
    for (const index in cities.features) {
        const feature = cities.features[index]
        const code = centroids.features[index].properties.ILKOD
        const name = centroids.features[index].properties.NAME
        let [x, y] = centroids.features[index].geometry.coordinates
        x = parseInt((x / 2000) - xSpace)
        y = parseInt(ySpace - (y / 2000))
        pointArray += `<g>`
        for (const polygon of feature.geometry.coordinates) {
            let points = ''
            for (const [_x, _y] of polygon[0]) {
                points += `${parseInt((_x / 2000) - xSpace)},${parseInt(ySpace - (_y / 2000))} `
            }
            pointArray += `<polygon points="${points}"/>`
        }
        if (data[code] && data[code].sayi) {
            totalMosqueCount += data[code].sayi
        }
        let totalPeople = data[code] ? data[code].a + data[code].b + data[code].c : '-'
        if (totalPeople > 0) {
            totalPeopleCount += totalPeople
        }
        pointArray += `
        <text x="${x}" y="${y}" fill="white">
            <tspan text-anchor="middle">${totalPeople}</tspan>
            </text>
            <desc>${data[code] ? JSON.stringify({ ...data[code], name, success: true, code }) : JSON.stringify({ name, code })}</desc>
        </g>`
    }
    if (!isNaN(totalMosqueCount)) {
        mapHeader.innerHTML = 'Cami Sayısı: ' + totalMosqueCount
        totalPeopleCountDom.innerHTML = 'Kayıt Sayısı: ' + totalPeopleCount
    }
    let svg = `
    <svg viewBox="0 0 1080 460" width="100%">
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
            city.innerHTML = cityData.name
            if (categoryA) categoryA.innerHTML = cityData.a;
            if (categoryB) categoryB.innerHTML = cityData.b;
            if (categoryC) categoryC.innerHTML = cityData.c;
            categoryTotal.innerHTML = cityData.a + cityData.b + cityData.c
            countOfMosque.innerHTML = cityData.sayi
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
        if(isMobile){
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
    const onClick = function(){
        const data = this.querySelector('desc')
        const code = JSON.parse(data.innerHTML).code
        location = link + code
    }
    const showOnWebSiteButton = document.querySelector('.map-menu .map-menu-show-on-web-site')
    showOnWebSiteButton.addEventListener('click', function(event){
        // console.log('selectedData', selectedData)
        const code = JSON.parse(selectedData.innerHTML).code
        location = link + code
    })
    const onTouch = function(event){
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

fetch(config.url).then(x => x.json()).then(data => {
    // delete data["1"]
    // delete data["2"]
    // delete data["3"]
    loadSvg(data)
})