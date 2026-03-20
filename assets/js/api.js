(function () {
  var API_BASE_URL = "https://restcountries.com/v3.1";
  var DEFAULT_TIMEOUT = 12000;

  async function request(path) {
    var controller = new AbortController();
    var timeoutId = window.setTimeout(function () {
      controller.abort();
    }, DEFAULT_TIMEOUT);

    try {
      var response = await fetch(API_BASE_URL + path, {
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error("Request failed with status " + response.status);
      }

      return await response.json();
    } finally {
      window.clearTimeout(timeoutId);
    }
  }

  async function getAllCountries() {
    var countries = await request(
      "/all?fields=name,flags,region,subregion,population,capital,cca3,continents,unMember",
    );

    return countries.filter(function (country) {
      return country.unMember === true || country.cca3 === "GNB";
    });
  }

  async function getCountryByCode(code) {
    var encodedCode = encodeURIComponent(code);
    var data = await request(
      "/alpha/" +
        encodedCode +
        "?fields=name,flags,region,subregion,population,capital,cca3,continents,languages,currencies,area,timezones,borders,independent,maps",
    );

    return Array.isArray(data) ? data[0] : data;
  }

  window.CountryAtlasApi = {
    getAllCountries: getAllCountries,
    getCountryByCode: getCountryByCode,
  };
})();
