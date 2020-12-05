//Initialiatize values
let activeTab = 'home';
const sectionTabs = ['home', 'world', 'politics', 'magazine', 'technology', 'science', 'health', 'sports', 'arts', 'fashion', 'food', 'travel'];
const newyorkTimesTopStoriesApiId = 'Gsj4BeBEKXpeuAfBNZUL1XWgy4dryrSU';
const requiredDateFormat = 'dd/MM/yyyy';
const defaultImage = 'default-image.jpg';

//Creating a dom element with properties elem, class,name and id. 
function createDomElement(elem, elemClass = '', elemName = '', elemId = '') {
    const element = document.createElement(elem);
    (elemClass !== '') && element.setAttribute('class', elemClass);
    (elemName !== '') && element.setAttribute('name', elemName);
    (elemId !== '') && element.setAttribute('id', elemId);
    return element;
}

//Create a page container to show the data according to categories selected.
let pageContainer = createDomElement('div', 'container');

//show loader till data is fetched.
//fetch data from the api according to selected category.
//convert the fetched data to json.
//hide loader on data successfully fetched.
//display the data fetch on the page according to category.
async function getCategoryInfo(selectedCategory) {
    try {
        showLoader();
        const results = await fetch(`https://api.nytimes.com/svc/topstories/v2/${selectedCategory}.json?api-key=${newyorkTimesTopStoriesApiId}`);
        const resultsJson = await results.json();
        hideLoader();
        displayTheDataFetchedOnPage(resultsJson);
    } catch (err) {
        console.log(err);
    }
}

//Create loader to show when data is still fetching.
//by default hide the loader for start. 
function createLoader() {
    let loadingPage = createDomElement('div', 'loading-page', 'loading-page', 'loading-page');
    let loaderContainer = createDomElement('div', 'loader-container', 'loader-container', 'loader-container');
    let loadingTypes = ['text-success', 'text-primary', 'text-danger', 'text-warning', 'text-info'];
    loadingTypes.forEach((item) => {
        let loaderContent = createDomElement('div', `spinner-grow ${item}`);
        let content = createDomElement('span', 'sr-only');
        content.innerHTML = 'Loading...';
        loaderContent.append(content);
        loaderContainer.appendChild(loaderContent);
    })
    loadingPage.append(loaderContainer);
    document.body.append(loadingPage);
    hideLoader();
}

//show the loader
function showLoader() {
    document.getElementById('loading-page').style.display = 'block';
}

//hide the loader
function hideLoader() {
    document.getElementById('loading-page').style.display = 'none';
}

//Initialize the app.
//Create a loader for first time.
//Fetch the default data for default tab.
function initializeApp() {
    createLoader();
    getCategoryInfo(activeTab);
}

//Change active tab on navbar.
//fetch data for the selected category.
function changeTab(selectedTab) {
    activeTab = selectedTab;
    getCategoryInfo(selectedTab);
}

//Create a navbar for the web site.
function createNavBar() {
    let navbarContainer = createDomElement('nav', 'navbar navbar-expand-lg navbar-light contanier');

    let titleContainer = createDomElement('div', 'title-container');
    let navBarTitle = createDomElement('span', 'navbar-brand nav-header');
    navBarTitle.innerHTML = 'Top Stories';

    let navbarToggleBtn = createDomElement('button', 'navbar-toggler collapsed');
    navbarToggleBtn.setAttribute('type', 'button');
    navbarToggleBtn.setAttribute('data-toggle', 'collapse');
    navbarToggleBtn.setAttribute('data-target', '#navbarToggle');
    navbarToggleBtn.setAttribute('aria-controls', 'navbarToggle');
    navbarToggleBtn.setAttribute('aria-expanded', false);

    let toggleIcon = createDomElement('span', 'navbar-toggler-icon');

    navbarToggleBtn.append(toggleIcon);

    titleContainer.append(navBarTitle, navbarToggleBtn);

    let navbarCollapse = createDomElement('div', 'collapse navbar-collapse', 'navbar-collapse', 'navbarToggle');

    let navbarUnorderedList = createDomElement('ul', 'navbar-nav ');
    sectionTabs.forEach((tab) => {
        let navbarElements = createDomElement('li', 'nav-item nav-link');
        if (activeTab === tab) {
            navbarElements.classList.add('active');
        }
        let anchorTag = createDomElement('a', 'nav-link');
        anchorTag.setAttribute('href', '#');
        anchorTag.innerHTML = tab;
        navbarElements.setAttribute('onclick', `changeTab('${tab}')`);
        navbarElements.append(anchorTag);
        navbarUnorderedList.appendChild(navbarElements);
    })
    navbarCollapse.append(navbarUnorderedList);

    navbarContainer.append(titleContainer, navbarCollapse);
    return navbarContainer;
}

//Create a jumbotron for main headline news to display.
function creatingNewsHeadline(headlineNews) {
    let headlineContainer = createDomElement('div', 'jumbotron p-3 p-md-5 text-white');
    headlineContainer.style = `background-image: linear-gradient(to bottom,rgba(0, 0, 0, 0.5),rgba(0, 0, 0, 0.5)),url("${headlineNews.multimedia[0].url}");background-size: cover`

    let headlineContentContainer = createDomElement('div', 'col-md-12 px-0');

    let headlineTitle = createDomElement('h1', 'display-4 title');
    headlineTitle.innerHTML = headlineNews.title;

    let headlineDatePublished = createDomElement('div', 'lead my-3');
    headlineDatePublished.innerHTML = headlineNews.published_date;

    let headlineAbstract = createDomElement('div', 'lead my-3');
    headlineAbstract.innerHTML = headlineNews.abstract;

    let headlineContinueReading = createDomElement('div', 'read-more lead mb-0');

    let textContainer = createDomElement('a');
    textContainer.setAttribute('href', `${headlineNews.url}`);
    textContainer.setAttribute('target', '_blank');
    textContainer.innerHTML = 'Continue Reading...'

    headlineContinueReading.append(textContainer);
    headlineContentContainer.append(headlineTitle, headlineDatePublished, headlineAbstract, headlineContinueReading);
    headlineContainer.append(headlineContentContainer);
    return headlineContainer;
}

//display fetched data on the page.
//clear the previous content on the page.
//create a new navbar with new active tab.
//create a news headline for the web site.
//create cards to dislay on the news platform.
//add to page container.
//append to the body.
function displayTheDataFetchedOnPage(resultsJson) {
    pageContainer.innerHTML = '';
    let navbarContainer = createNavBar();
    let headlineContainer = creatingNewsHeadline(resultsJson.results[0]);
    let news = resultsJson.results.slice(1, resultsJson.results.length);
    let cardNewsContainer = createCardsForNews(news);
    pageContainer.append(navbarContainer, headlineContainer, cardNewsContainer);
    document.body.append(pageContainer);
}

//create cards for all the news item.
function createCardsForNews(newsList) {
    let newsContainer = createDomElement('div', 'container');
    let newsRowContainer = createDomElement('div', 'row');
    newsList.forEach((news) => {
        newsRowContainer.appendChild(createCardForSingleNews(news));
    })
    newsContainer.append(newsRowContainer);
    return newsContainer;
}

//create a single card for news.
function createCardForSingleNews(news) {
    let cardColContainer = createDomElement('div', 'col-lg-6 col-sm-12');

    let cardContainerForNews = createDomElement('div', 'card flex-md-row mb-4 custom-card h-md-250');

    let cardBodyForNews = createDomElement('div', 'card-body d-flex flex-column align-items-start');

    let titleForNews = createDomElement('h5', 'mb-0 text-dark title');
    titleForNews.innerHTML = news.title;

    let datePublishedNews = createDomElement('div', 'mb-1 text-muted');
    datePublishedNews.innerHTML = news.published_date;

    let newsContent = createDomElement('div', 'card-text mb-auto');
    newsContent.innerHTML = news.abstract;

    let continueReading = createDomElement('div', 'mb-auto continue-reading text-primary');

    let textContainer = createDomElement('a');
    textContainer.setAttribute('href', `${news.url}`);
    textContainer.setAttribute('target', '_blank');
    textContainer.innerHTML = 'Continue Reading...';

    continueReading.append(textContainer);

    let imgForNews = createDomElement('img', 'card-img-right flex-auto d-none d-md-block img');
    imgForNews.setAttribute('src', `${news.multimedia !== null ? news.multimedia[0].url : defaultImage} `);

    cardBodyForNews.append(titleForNews, datePublishedNews, newsContent, continueReading);
    cardContainerForNews.append(cardBodyForNews, imgForNews);
    cardColContainer.append(cardContainerForNews);
    return cardColContainer;
}

//call the initialize app to get the default page.
initializeApp();