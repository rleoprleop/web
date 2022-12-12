//지도 그리기
export function drawMap() {
    const width = 500;
    const height = 500;
    // 지도를 그리기 위한 svg 생성
    const svg = d3
        // .select('.d3')
        .select('#container')
        .append('svg')
        .attr('width', width + 'px')
        .attr('height', height + 'px');

    // 지도가 그려지는 그래픽 노드(g) 생성
    const g = svg.append('g');
    // 지도가 그려지는 그래픽 노드
    const mapLayer = g.append('g').classed('map-layer', true);

    // 지도의 출력 방법을 선택(메로카토르)
    let projection = d3.geoMercator()
        .scale(1)
        .center([0, 0])
        .translate([0, 0])

    d3.json('/public/json/features.geojson').then(function (geojs) {
        // svg 그림의 크기에 따라 출력될 지도의 크기를 다시 계산
        const path = d3.geoPath(projection);
        const pathbounds = path.bounds(geojs);
        const geobounds = d3.geoBounds(geojs);
        const widthScale = (pathbounds[1][0] - pathbounds[0][0]) / width;
        const heightScale = (pathbounds[1][1] - pathbounds[0][1]) / height;
        const scale = 0.95 / Math.max(widthScale, heightScale);
        const xoffset = (geobounds[1][0] + geobounds[0][0]) / 2;
        const yoffset = (geobounds[1][1] + geobounds[0][1]) / 2;
        const center = [xoffset, yoffset];
        const offset = [width / 2, height / 2];
        projection.scale(scale).center(center).translate(offset);
        console.log(widthScale, heightScale, scale, center, pathbounds, geobounds);

        // 지도 그리기
        mapLayer
            .selectAll('path')
            .data(geojs.features)
            .enter()
            .append('path')
            .attr('d', function (d) {
                return path(d);
            })
            .attr('name', function (d) {
                return d.properties.CTP_KOR_NM;
            })
            .on('click', function () {
                var id = $(this).attr('name')
                console.log(id);
                var local = document.getElementById("local_weather")
                local.style.display = 'block'
                local.innerText = id
                //$.post('/c', { section1: id })  // 서버가 필요한 정보를 같이 보냄
                var form = document.createElement("form");
                form.setAttribute("method", "post");  //Post 방식
                form.setAttribute("action", "/map"); //요청 보낼 주소
                var hiddenField = document.createElement("input");
                hiddenField.setAttribute("type", "text");
                hiddenField.setAttribute("name", "section1");
                hiddenField.setAttribute("value", id);
                form.appendChild(hiddenField);
                document.body.appendChild(form);
                form.submit();
                document.body.removeChild(form);
            })
            .on('mouseover', function () {
                var id = $(this).attr('name')
                console.log(id);
                var local = document.getElementById("local_weather")
                local.style.display = 'block'
                local.innerText = id
                
            })
            .on('mouseout', function () {
                document.getElementById("local_weather").style.display = 'none'
            })
            .on('mousemove',(e)=>{
                var local = document.getElementById("local_weather")
                var mousexy=d3.pointer(e)
                var mousex= mousexy[0]
                var mousey = mousexy[1]
                local.style.left = mousex+50 + 'px'
                local.style.top = mousey+130 + 'px'
                console.log(mousexy);
            })
    });
}
