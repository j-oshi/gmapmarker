export default function loadGoogleApi(mapKey) {
    let scriptIsLoaded = false;
    // Check if script is already loaded
    let scripts = [...document.querySelectorAll("script")];
    let urlArray = scripts.map(script => script.src.includes("https://maps.googleapis.com/maps/api/js")).filter(urlExist => urlExist === true);
    if (urlArray.length > 0) {
        scriptIsLoaded = true;
    } else {
        let scriptTag = document.createElement('script');
        scriptTag.setAttribute('src', `https://maps.googleapis.com/maps/api/js?key=${mapKey}`);
        document.getElementsByTagName('head')[0].appendChild(scriptTag);
        scriptIsLoaded = true;
    }
    return scriptIsLoaded;    
}