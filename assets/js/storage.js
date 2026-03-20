(function () {
  var STORAGE_KEY = "countryAtlasFavorites";

  function readFavorites() {
    try {
      var rawValue = window.localStorage.getItem(STORAGE_KEY);
      var parsedValue = rawValue ? JSON.parse(rawValue) : [];
      return Array.isArray(parsedValue) ? parsedValue : [];
    } catch (error) {
      return [];
    }
  }

  function writeFavorites(favorites) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    window.dispatchEvent(new CustomEvent("favorites-updated"));
    return favorites;
  }

  function getFavorites() {
    return readFavorites();
  }

  function isFavorite(code) {
    return readFavorites().some(function (country) {
      return country.code === code;
    });
  }

  function saveFavorite(country) {
    var favorites = readFavorites();
    var alreadySaved = favorites.some(function (favorite) {
      return favorite.code === country.code;
    });

    if (alreadySaved) {
      return favorites;
    }

    favorites.push(country);
    favorites.sort(function (firstCountry, secondCountry) {
      return firstCountry.name.localeCompare(secondCountry.name);
    });

    return writeFavorites(favorites);
  }

  function removeFavorite(code) {
    var favorites = readFavorites().filter(function (country) {
      return country.code !== code;
    });

    return writeFavorites(favorites);
  }

  function toggleFavorite(country) {
    if (isFavorite(country.code)) {
      removeFavorite(country.code);
      return false;
    }

    saveFavorite(country);
    return true;
  }

  window.CountryAtlasStorage = {
    getFavorites: getFavorites,
    isFavorite: isFavorite,
    saveFavorite: saveFavorite,
    removeFavorite: removeFavorite,
    toggleFavorite: toggleFavorite,
  };
})();
