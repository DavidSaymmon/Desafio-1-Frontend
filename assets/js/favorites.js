(function () {
  var storage = window.CountryAtlasStorage;
  var ui = window.CountryAtlasUi;

  var summary = document.getElementById("favorites-summary");
  var grid = document.getElementById("favorites-grid");
  var emptyState = document.getElementById("favorites-empty");

  function updateSummary(count) {
    if (count === 0) {
      summary.textContent = "You have not saved any countries yet.";
      return;
    }

    if (count === 1) {
      summary.textContent = "You have 1 favorite country.";
      return;
    }

    summary.textContent = "You have " + count + " favorite countries.";
  }

  function renderFavorites() {
    var favorites = storage.getFavorites();
    grid.innerHTML = "";
    updateSummary(favorites.length);

    if (favorites.length === 0) {
      grid.hidden = true;
      emptyState.hidden = false;
      return;
    }

    emptyState.hidden = true;

    favorites.forEach(function (country) {
      grid.appendChild(
        ui.createCountryCard(country, function () {
          renderFavorites();
        })
      );
    });

    grid.hidden = false;
  }

  renderFavorites();
})();
