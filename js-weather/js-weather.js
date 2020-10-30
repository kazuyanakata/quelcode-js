document.addEventListener('DOMContentLoaded', function () {
  const defaultCityId = '2643743'//ロンドンの都市ID

  const setValue = function (value) {
    const opts = document.getElementById('city').options;
    for (let i = 0, len = opts.length; i < len; i++) {
      let opt = opts.item(i);
      if (value.indexOf(opt.value) > -1) {
        opt.selected = true;
      }
    }
  };
  setValue(defaultCityId);

  const setWeather = function (value) {
    const result = document.getElementById('result');
    const xhr = new XMLHttpRequest();

    xhr.addEventListener('loadstart', function () {
      result.textContent = '通信中・・・';
    }, false);

    xhr.addEventListener('load', function () {
      const data = JSON.parse(xhr.responseText);

      // 天気情報表示時の<div>の作成
      const weatherTitle = document.createElement('div');//表示都市及び取得時間の表示用
      weatherTitle.className = 'weatherTitle';
      const infos = document.createElement('div');//各詳細情報の表示用(display:flex;にて表示を整える目的で作成)
      infos.className = 'infos';
      const mainInfo = document.createElement('div');//天気及び天気の画像表示用
      mainInfo.className = 'mainInfo';
      const subInfo = document.createElement('div');//その他詳細情報表示用(気温・体感温度・湿度)
      subInfo.className = 'subInfo';

      // 各表示情報ごとにの要素ノード及びテキストノードを作成
      const city = document.createElement('h2');// 都市情報
      city.className = 'city';
      const cityText = document.createTextNode(`${data.name}の天気`);

      const getTime = new Date(data.dt * 1000);// 取得日時(日本時間)
      const time = document.createElement('p');
      time.className = 'time';
      const timeText = document.createTextNode(`<${getTime.toLocaleString()} 時点(日本時間)>`);

      const img = document.createElement('img');// 天気画像
      img.className = 'img';
      img.src = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`;
      img.alt = `${data.name}の天気の画像`;

      const weather = document.createElement('p');// 天気
      weather.className = 'weather'
      const weatherText = document.createTextNode(data.weather[0].description);

      const tmp = document.createElement('p');// 気温
      const tmpText = document.createTextNode(`気温：${data.main.temp}°C`);

      const feelTmp = document.createElement('p');// 体感温度
      const feelTmpText = document.createTextNode(`体感温度：${data.main.feels_like}°C`);

      const humidity = document.createElement('p');// 湿度
      const humidityText = document.createTextNode(`湿度：${data.main.humidity}％`);

      // 要素ノードとテキストノードの組み立て
      city.appendChild(cityText);
      time.appendChild(timeText);
      weather.appendChild(weatherText);
      tmp.appendChild(tmpText);
      feelTmp.appendChild(feelTmpText);
      humidity.appendChild(humidityText);

      // 文書ツリーの組み立て
      weatherTitle.appendChild(city);
      weatherTitle.appendChild(time);
      mainInfo.appendChild(img);
      mainInfo.appendChild(weather);
      subInfo.appendChild(tmp);
      subInfo.appendChild(feelTmp);
      subInfo.appendChild(humidity);

      infos.appendChild(mainInfo);
      infos.appendChild(subInfo);

      result.replaceChild(weatherTitle, result.firstChild);
      result.appendChild(infos);
    }, false);

    xhr.addEventListener('error', function () {
      result.textContent = 'エラーが発生しました。';
    }, false);

    xhr.open('GET', `http://api.openweathermap.org/data/2.5/weather?lang=ja&units=metric&appid=4b5774e9f3d2a07b84f0f2f88e486224&id=${encodeURIComponent(value)}`, true);
    xhr.send(null);
  }
  setWeather(defaultCityId);

  document.getElementById('city').addEventListener('change', function (e) {
    setWeather(e.target.value);
  }, false);
}, false);
