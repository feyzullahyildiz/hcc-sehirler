const cities = require('./iller.json')
const centroids = require('./iller-orta.json')
const config = require('./config')
const map = document.querySelector('#turkey-svg-cities-continer .map-container .map')
const mapHeader = document.querySelector('#turkey-svg-cities-continer .map-container .map-header')
const menu = document.querySelector('#turkey-svg-cities-continer .map-menu')

const city = menu.querySelector('.map-menu-city')
const categoryA = menu.querySelector('.map-menu-category.a')
const categoryB = menu.querySelector('.map-menu-category.b')
const categoryC = menu.querySelector('.map-menu-category.c')
const categoryTotal = menu.querySelector('.map-menu-category-total')
const countOfMosque = menu.querySelector('.map-menu-mosque-count')
// [ 2857405, 4275017 ], [ 2857405, 5175729 ], [ 4989109, 5175729 ], [ 4989109, 4275017 ], [ 2857405, 4275017 ] //bbox
const loadSvg = function(data){
    const xSpace = 1420
    const ySpace = 2590
    let pointArray = ''
    let totalMosqueCount = 0
    for(const index in cities.features){
        const feature = cities.features[index]
        const code = centroids.features[index].properties.ILKOD
        const name = centroids.features[index].properties.NAME
        let [x, y] = centroids.features[index].geometry.coordinates
        x = parseInt((x/2000) - xSpace)
        y = parseInt(ySpace - (y/2000))
        pointArray += `<g>`
        for (const polygon of feature.geometry.coordinates) {
            let points = ''
            for (const [_x, _y] of polygon[0]) {
                points += `${parseInt((_x/2000) - xSpace)},${parseInt(ySpace - (_y/2000))} `
            }
            pointArray +=`<polygon points="${points}"/>`
        }
        if(data[code] && data[code].sayi){
            totalMosqueCount += data[code].sayi
        }
        pointArray += `
        <text x="${x}" y="${y}" fill="white">
            <tspan text-anchor="middle">${data[code] ? (data[code].a + data[code].b + data[code].c): '-'}</tspan>
            </text>
            <desc>${data[code] ? JSON.stringify({...data[code], name, success: true}): JSON.stringify({name})}</desc>
        </g>`
    }
    if(!isNaN(totalMosqueCount)){
        mapHeader.innerHTML = 'Toplam Cami ' + totalMosqueCount
    }
    let svg = `
    <svg viewBox="0 0 1080 460" width="100%">
    ${pointArray}
    </svg>
    `
    map.innerHTML = svg
    
    const citiesPolygons = map.querySelectorAll('svg g')
    let oldPolygons
    const onEnter = function(){
        if(oldPolygons){
            oldPolygons.forEach(oldPolygon => {
                oldPolygon.style.fill = ''
            })
        }
        oldPolygons = []
        this.querySelectorAll('polygon').forEach(polygon => {
            oldPolygons.push(polygon)
            polygon.style.fill = '#f49225'
        })
        const data = this.querySelector('desc')
        if(data.innerHTML && JSON.parse(data.innerHTML).success){
            // menu.style.display = 'flex'
            menu.style.opacity = 1
            const cityData = JSON.parse(data.innerHTML)
            city.innerHTML = cityData.name
            categoryA.innerHTML = cityData.a
            categoryB.innerHTML = cityData.b
            categoryC.innerHTML = cityData.c
            categoryTotal.innerHTML = cityData.a + cityData.b + cityData.c
            countOfMosque.innerHTML = cityData.sayi
        }else{
            city.innerHTML = JSON.parse(data.innerHTML).name
            categoryA.innerHTML = 0
            categoryB.innerHTML = 0
            categoryC.innerHTML = 0
            categoryTotal.innerHTML = 0
            countOfMosque.innerHTML = 0
        }
    }
    citiesPolygons.forEach(city => {
        city.addEventListener('click', onEnter)
    })
}

fetch(config.url).then(x => x.json()).then(data => {
    // delete data["1"]
    // delete data["2"]
    // delete data["3"]
    loadSvg(data)
})