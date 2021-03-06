/*
*   FUNCTIONS HTML
*   Se usan para mostrar contenido html
*/

// Cogemos la imagen o no imagen
const getImage = (name) => {
    if (name) {
        return 'https://image.tmdb.org/t/p/w440_and_h660_face'+name;
    } else {
        return './no.jpg';
    }
}

// Mostramos los votos con clase
const getVotes = (votes) => {
    html = '';
    if (votes > 0) {
        votes = votes * 10;
        var c = '';
        if (votes > 80) {
            c = 'top';
        } else if (votes > 60) {
            c = 'med-top'
        } else if (votes > 40) {
            c = 'med'
        } else {
            c = 'low'
        }
        html = '<span class="votes '+c+'">'+(votes + '%')+'</span>';
    }
    return html;
}

const getCurrentPage = () => {
    if (document.querySelector('#pagination .page.active') !== null) {
        return parseInt(document.querySelector('#pagination .page.active').innerHTML)
    } else {
        return 1;
    }
}

/*
*   FUNCTIONS API
*   Se usan para obtener la url de la API
*/

// URL API
const getBaseUrl = () => 'https://api.themoviedb.org/3/';

// Ponemos la variable de la API
const getApi = () => '?api_key=cea68b520beecac6718820e4ac576c3a';

// Ponemos la variable del idioma
const getLanguage = (id) => {
    var languages = {
        1 : 'es-ES',
        2 : 'en-US',
        3 : 'pt-PT',
        4 : 'de-DE',
        5 : 'ca',
    }
    return '&language='+languages[id];
}

// Ponemos las variables del tipo de búsqueda
const getApiUrl = (type, v, id_lang = 1, page = 1) => new Promise((res, err) => {
    let url = '';
    if (type == '') {
        err(new Error('Error al obtener la API'));
    }
    if (type == 'search') {
        url = getBaseUrl() + 'search/movie' + getApi() + getLanguage(id_lang) + '&query=' + encodeURI(v) + '&page=' + parseInt(page);
    } else {
        url = getBaseUrl() + 'movie/'+ type + getApi() + getLanguage(id_lang) + '&page=' + parseInt(page);
    }
    res(url)
})

// Función para desplazarnos por las páginas
const goPage = (page, reload = true) => {
    if (document.querySelector('.page.active') !== null) {
        let active = document.querySelector('.page.active');
        active.classList.remove('active');

        let pages = document.getElementsByClassName('page');
        for (let i = 0; i < pages.length; i++) {
            if (parseInt(pages[i].innerHTML) == page) {
                pages[i].classList.add('active');
                if (reload !== false) {
                    return beginAction(null);
                }
                return;
            }
        }
    }
}

/*
*   FUNCTIONS DATOS
*   Se usan para mostrar transformar el contenido de la API
*/
// Cogemos el contenido de la url
const getContent = (url) => new Promise((res, err) => {
    if (url != '') {
        res(fetch(url))
    } else {
        err(new Error('Error con la url'))
    }
})

// Convertimos el contenido a json
const getResult = (data) => new Promise((res, err) => {
    if (typeof data != 'undefined') {
        res(data.json());
    } else {
        err(new Error('Error con los resultados'))
    }
})

// Preparamos los datos de las pelis
const getPeliculas = (data) => new Promise((res, err) => {
    if (typeof (data.results) != 'undefined') {
        res(data)
    } else {
        var r = {
            'results' : [data],
            'total_results' : 1,
            'total_pages' : 1,
        }
        res(r)
    }
})

// Creamos el listado html
const renderResult = (data) => new Promise((res, err) => {
    var html = '';
    data.results.forEach(p => {
        html += `
            <li class="film">
                <img src="${getImage(p.poster_path)}">
                <h3>${p.title}</h3>
                <div class="description">
                    <p>${p.overview}</p>
                </div>
                ${getVotes(p.vote_average)}
            </li>`;
    })
    if (html == '') {
        html += '<p class="alert">No ha habido resultados para la búsqueda</p>';
    }
    var html_data = {
        'html' : html,
        'pages' : data.total_pages == 0 ? 1 : data.total_pages,
    }
    res(html_data)
})

// Mostramos el contenido html
const showResult = (data) => {
    document.getElementById('result').innerHTML = data.html;
    document.getElementById('pagination').innerHTML = getPagination(data.pages);
}

// empezamos las acciones de filtrado
const beginAction = (action) => {
    if (action !== null) {
        goPage(1, false);
        let a = document.getElementsByClassName('btn');
        for (let i = 0; i < a.length; i++) {
            a[i].classList.remove('active');
        }
        let c = document.getElementById('btn-'+action);
        c.classList.add('active');
    }
    doQueryFilm();
}

// Hacemos la búsqueda
const doQueryFilm = () => new Promise((res, err) => {
    if (document.querySelector('.btn.active') !== null) {
        var type = document.querySelector('.btn.active').id.replace('btn-','');
    } else {
        var type = 'search';
    }
    var v = document.getElementById('input-search').value;
    var id_lang = document.getElementById('idLang').value;
    var page = getCurrentPage();
    getApiUrl(type, v, id_lang, page)
        .then(getContent)
        .then(getResult)
        .then(getPeliculas)
        .then(renderResult)
        .then(showResult)
        .catch(e => console.error(e.message))
})

/*
*   FUNCTIONS BOTONES
*   Creamos los listeners de los botones
*/
// Botones
document.getElementById('btn-search').addEventListener('click', () => {
    beginAction('search');
})

document.getElementById('btn-popular').addEventListener('click', () => {
    beginAction('popular');
})

document.getElementById('btn-top_rated').addEventListener('click', () => {
    beginAction('top_rated');
})

document.getElementById('btn-upcoming').addEventListener('click', () => {
    beginAction('upcoming');
})

document.getElementById('btn-latest').addEventListener('click', () => {
    beginAction('latest');
})

document.getElementById('btn-now_playing').addEventListener('click', () => {
    beginAction('now_playing');
})

document.getElementById('idLang').addEventListener('change', () => {
    beginAction(null);
})

// Acción al cargar
beginAction('popular');


const getPagination = (total) => {
    let html = '';
    let page = getCurrentPage();
    if (total < 5) {
        for (let i = 1; i <= total; i++) {
            let c = '';
            if (i == page || total == 1) {
                c = 'active';
            }
            html += addPageBtn(i, c);
        }
    } else {
        if (page < 5) {
            for (let i = 1; i <= 5; i++) {
                let c = '';
                if (i == page) {
                    c = 'active';
                }
                html += addPageBtn(i, c);
            }
            html += addNoPageBtn()
            html += addPageBtn(total);
        } else if((page + 3) >= total) {
            html += addPageBtn(1);
            html += addNoPageBtn()
            for (let i = (total - 5); i <= total; i++) {
                let c = '';
                if (i == page) {
                    c = 'active';
                }
                html += addPageBtn(i, c);
            }
        }else {
            html += addPageBtn(1)
            html += addNoPageBtn()
            for (let i = (page - 2); i <= (page + 2); i++) {
                let c = '';
                if (i == page) {
                    c = 'active';
                }
                html += addPageBtn(i, c)
            }
            html += addNoPageBtn();
            html += addPageBtn(total);

        }
    }
    return html;
}

const addPageBtn = (i, c = null) => `<span onclick="goPage(${i})" class="page ${c}">${i}</span>`;
const addNoPageBtn = () => '<span class="page">...</span>';