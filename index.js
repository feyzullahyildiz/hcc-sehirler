const cities = require('./iller.json')
const centroids = require('./iller-orta.json')
const config = require('./config')
const container = document.querySelector('#turkey-svg-citiescontiner .container')
const menu = document.querySelector('#turkey-svg-citiescontiner .menu')

// [ 2857405, 4275017 ], [ 2857405, 5175729 ], [ 4989109, 5175729 ], [ 4989109, 4275017 ], [ 2857405, 4275017 ] //bbox
const loadSvg = function(data){
    const xSpace = 1420
    const ySpace = 2590
    let pointArray = ''
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
        pointArray += `
        <text x="${x}" y="${y}" fill="white">
            <tspan text-anchor="middle">${data[code] ? (data[code].a + data[code].b + data[code].c): '-'}</tspan>
            </text>
            <desc>${data[code] ? JSON.stringify({...data[code], name}): ''}</desc>
        </g>`
    }
    let svg = `
    <svg viewBox="0 0 1080 460" width="100%">
    ${pointArray}
    </svg>
    `
    container.innerHTML = svg
    
    const [city, categoryA, categoryB, categoryC, categoryTotal, countOfMosque] = menu.querySelectorAll('li span')
    // console.log('city', city)
    const citiesPolygons = container.querySelectorAll('svg g')
    const onEnter = function(){
        this.querySelectorAll('polygon').forEach(polygon => {
            polygon.style.fill = '#ff922b'
        })
        const data = this.querySelector('desc')
        if(data.innerHTML){
            menu.style.display = 'flex'
            const cityData = JSON.parse(data.innerHTML)
            city.innerHTML = cityData.name
            categoryA.innerHTML = cityData.a
            categoryB.innerHTML = cityData.b
            categoryC.innerHTML = cityData.c
            categoryTotal.innerHTML = cityData.a + cityData.b + cityData.c
            countOfMosque.innerHTML = cityData.sayi
        }
    }
    const onLeave = function(){
        this.querySelectorAll('polygon').forEach(polygon => {
            polygon.style.fill = ''
        })
        menu.style.display = 'none'
    }
    const onMove = function(event){
        menu.style.left = event.clientX + 30
        menu.style.top = event.clientY
    }
    citiesPolygons.forEach(city => {
        city.addEventListener('mouseenter', onEnter)
        city.addEventListener('mouseleave', onLeave)
        city.addEventListener('mousemove', onMove)
    })
}

fetch(config.url).then(x => x.json()).then(data => {
    delete data["1"]
    delete data["2"]
    delete data["3"]
    loadSvg(data)
})