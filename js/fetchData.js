let cachedData = null;
let detailsCache = {}; 

function getIdFromUrl() {
    var urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

function fetchData() {
    if (cachedData) {
        displayData(cachedData);
        return Promise.resolve(cachedData);
    }

    return fetch('https://script.google.com/macros/s/AKfycbwVqQ0jeSe_zcXP6lZHqnmuI5xWpc_Og5AvvjJAkQ7ScWWBVJxoPae89VkZ7HGnWSjW/exec')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            cachedData = data;
            data.shift();
            displayData(data);
            return data;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            throw error;
        });
}

function fetchDetails(id) {
    if (detailsCache[id]) {
        displayDetails(detailsCache[id]);
        return Promise.resolve(detailsCache[id]);
    }

    return fetch(`https://script.google.com/macros/s/AKfycbwVqQ0jeSe_zcXP6lZHqnmuI5xWpc_Og5AvvjJAkQ7ScWWBVJxoPae89VkZ7HGnWSjW/exec?id=${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            detailsCache[id] = data;
            displayDetails(data);
            return data;
        })
        .catch(error => {
            console.error('Error:', error);
            throw error;
        });
}

function displayData(data) {
    var dataList = document.getElementById('dataList');
    data.forEach(function(item) {
        var listItem = document.createElement('li');
        var nameElement = document.createElement('p');
        nameElement.textContent = item.name;
        listItem.appendChild(nameElement);
        var imgLink = document.createElement('a');
        imgLink.href = './details.html?id=' + item.id;
        var imgElement = document.createElement('img');
        imgElement.src = './imgs/' + item.fileName;
        imgElement.alt = 'Image';
        imgLink.appendChild(imgElement);
        listItem.appendChild(imgLink);
        listItem.appendChild(nameElement);
        dataList.appendChild(listItem);
    });
}

function displayDetails(data) {
    var detailsDiv = document.getElementById('details');
    detailsDiv.innerHTML = `<h2>Details</h2>
                            <p>ID: ${data.id}</p>
                            <p>Name: ${data.name}</p>
                            <p>Image:</p>
                            <img src="./imgs/${data.fileName}" alt="${data.name}" style="max-width: 100%;" />`;
}

window.onload = function() {
    var id = getIdFromUrl();
    if (id) {
        fetchDetails(id);
    } else {
        fetchData();
    }
};

