import '../sass/main.scss';
import { NEWS_API_KEY } from '../config.js';

interface Article {
    author: string;
    description: string;
    source: {
        id: string;
        name: string;
    };
    title: string;
    url: string;
    urlToImage: string;
}

let elementCount = 0;
let currentWindowID = 'a';

const getInputValue = () => document.querySelector('input').value;

const addBox = (currentWindowID, article: Article) => {
    console.info(article);
    const window = document.querySelector(`#${currentWindowID}`);
    const newBox = document.createElement('div');
    newBox.classList.add('box');
    
    const linkElement = document.createElement('a');
    linkElement.href = article.url;

    const imageElement = document.createElement('img');
    imageElement.src = article.urlToImage;

    const titleElement = document.createElement('h3');
    titleElement.innerText = article.title;

    const sourceElement = document.createElement('h5');
    sourceElement.innerText = article.source.name;

    const descElement = document.createElement('p');
    descElement.innerText = article.description;
   
    linkElement.appendChild(titleElement);
    newBox.appendChild(linkElement);
    newBox.appendChild(sourceElement);
    newBox.appendChild(imageElement);
    newBox.appendChild(descElement);
    
    window.appendChild(newBox);
}

const addWindow = () => {
    const main = document.querySelector('main');
    const newWindow = document.createElement('div');
    newWindow.classList.add('window');

    currentWindowID = String.fromCharCode(currentWindowID.charCodeAt(0) + 1);
    newWindow.id = currentWindowID;
    console.info(newWindow.id)
    main.appendChild(newWindow);
}

const addElement = (article) => {
    console.info(++elementCount);
    if (elementCount > 1 && elementCount % 2 === 1) {
        addWindow();
    }
    
    addBox(currentWindowID, article);
}

const stringify = (queryParams: { [key: string]: string })  => {
    return Object.keys(queryParams)
        .reduce(
            (acc, curr) => acc.concat(
                [ curr, queryParams[curr] ].join('=')
            ), 
        [])
        .join('&');
}

const fetchHeadlines = async (searchTerm: string) => {
    const search = stringify({
        // q: searchTerm,
        sources: 'bbc-news',
        language: 'en',
    });

    console.info(search);
    const url = `https://newsapi.org/v2/top-headlines?${search}`;
    const headers = new Headers({
        'X-API-Key': NEWS_API_KEY,
    });

    const stream = await fetch(url, { headers });
    const response = await stream.json();

    return response.articles;
}

const populateStories = async () => {
    const articles = await fetchHeadlines(getInputValue());

    for (let index in articles) {
        addElement(articles[index]);
    }
}

document.querySelector('header').addEventListener('click', () => populateStories());
document.querySelector('input').value = 'bitcoin';
