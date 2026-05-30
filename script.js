// グローバル変数定義
let map;
let currentMarker;
let markerGroup;
let pinList = JSON.parse(localStorage.getItem("pinList")) || [];
console.log(pinList);

// 現在地取得メソッド
async function getCurrentPosition() {

    return new Promise((resolve) => {

        navigator.geolocation.getCurrentPosition(

            function (position) {

                resolve({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });

            },

            function () {

                // GPS取得失敗時は東京駅
                resolve({
                    lat: 35.681236,
                    lng: 139.767125
                });

            }

        );

    });

}

// ピン描画メソッド
function drawPin() {

    markerGroup.clearLayers();

    pinList.forEach((pinInfo, index) => {

        const marker = L.marker([pinInfo.lat, pinInfo.lng])
            .addTo(markerGroup);

        marker.bindPopup(`
            <label>
                <input type="checkbox" data-index="${index}" ${pinInfo.visited ? "checked" : ""}>
                訪問済み
            </label>
            <div id="delete">
                <button data-index="${index}">削除</button>
            </div>
        `);

    });

}

// ピン追加メソッド
function addPin(lat, lng) {
    pinList.push({
        lat:lat,
        lng:lng,
        visited:false
    });

    // ローカルストレージに保存
    localStorage.setItem("pinList", JSON.stringify(pinList));

    // ピンを再描画
    drawPin();
}

// ピン削除メソッド
function deletePin(index) {

    pinList.splice(index, 1);

    localStorage.setItem("pinList", JSON.stringify(pinList));

    drawPin();

}

// 訪問切り替えメソッド
function toggleVisited(index) {

    pinList[index].visited = !pinList[index].visited;

    localStorage.setItem("pinList", JSON.stringify(pinList));

    drawPin();

}

// メインメソッド
async function main() {
    const currentPosition = await getCurrentPosition();
    console.log(currentPosition.lat);
    console.log(currentPosition.lng);

    // 緯度経度でMAPを生成
    map = L.map('map').setView([currentPosition.lat, currentPosition.lng], 13);
    L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
            attribution: '&copy; OpenStreetMap contributors'
        }
    ).addTo(map);

    map.on("popupopen", function () {

        document.querySelectorAll("button").forEach(btn => {
            btn.onclick = function () {
                deletePin(this.dataset.index);
            };
        });

        document.querySelectorAll("input[type=checkbox]").forEach(cb => {
            cb.onchange = function () {
                toggleVisited(this.dataset.index);
            };
        });

    });

    markerGroup = L.layerGroup().addTo(map);

    // 現在位置をマーク
    currentMarker = L.circleMarker([currentPosition.lat, currentPosition.lng], {
        radius: 8
    }).addTo(map);

    // マップをクリックしたときのイベント
    map.on('click', function (e) {
        addPin(e.latlng.lat, e.latlng.lng);
    });

    navigator.geolocation.watchPosition(function (position) {

        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        currentMarker.setLatLng([lat, lng]);
    });

    // ピン描画
    drawPin();
}

main();