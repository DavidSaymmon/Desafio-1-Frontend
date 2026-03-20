(function () {
  function formatPopulation(value) {
    if (typeof value !== "number") {
      return "Not available";
    }

    return new Intl.NumberFormat("en-US").format(value);
  }

  function formatArea(value) {
    if (typeof value !== "number") {
      return "Not available";
    }

    return new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 0,
    }).format(value) + " sq km";
  }

  function formatList(items) {
    if (!Array.isArray(items) || items.length === 0) {
      return "Not available";
    }

    return items.join(", ");
  }

  function getCountryName(country) {
    return country && country.name && country.name.common
      ? country.name.common
      : "Unknown country";
  }

  function getOfficialName(country) {
    return country && country.name && country.name.official
      ? country.name.official
      : "Not available";
  }

  function getCapital(country) {
    return country && Array.isArray(country.capital) && country.capital.length > 0
      ? country.capital[0]
      : "Not available";
  }

  function getLanguages(country) {
    return country && country.languages ? Object.values(country.languages) : [];
  }

  function getCurrencies(country) {
    if (!country || !country.currencies) {
      return [];
    }

    return Object.values(country.currencies).map(function (currency) {
      return currency.name;
    });
  }

  function getFlag(country) {
    return country && country.flags && (country.flags.svg || country.flags.png)
      ? country.flags.svg || country.flags.png
      : "";
  }

  function getFlagAlt(country) {
    return country && country.flags && country.flags.alt
      ? country.flags.alt
      : "Country flag";
  }

  function getGoogleMapsLink(country) {
    return country && country.maps && country.maps.googleMaps
      ? country.maps.googleMaps
      : "";
  }

  function getBorders(country) {
    return country && Array.isArray(country.borders) ? country.borders : [];
  }

  function normalizeCountry(country) {
    return {
      code: country.cca3,
      name: getCountryName(country),
      officialName: getOfficialName(country),
      capital: getCapital(country),
      population: country.population || null,
      region: country.region || "Not available",
      subregion: country.subregion || "Not available",
      continents: Array.isArray(country.continents) ? country.continents : [],
      languages: getLanguages(country),
      currencies: getCurrencies(country),
      area: typeof country.area === "number" ? country.area : null,
      timezones: Array.isArray(country.timezones) ? country.timezones : [],
      borders: getBorders(country),
      independent:
        typeof country.independent === "boolean" ? country.independent : null,
      flag: getFlag(country),
      flagAlt: getFlagAlt(country),
      mapsLink: getGoogleMapsLink(country),
    };
  }

  function buildDetailsUrl(code) {
    return "./details.html?code=" + encodeURIComponent(code);
  }

  window.CountryAtlasHelpers = {
    buildDetailsUrl: buildDetailsUrl,
    formatArea: formatArea,
    formatList: formatList,
    formatPopulation: formatPopulation,
    getCapital: getCapital,
    normalizeCountry: normalizeCountry,
  };
})();
