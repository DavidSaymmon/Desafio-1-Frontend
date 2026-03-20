(function () {
  var api = window.CountryAtlasApi;
  var helpers = window.CountryAtlasHelpers;
  var ui = window.CountryAtlasUi;

  var searchForm = document.getElementById("search-form");
  var searchInput = document.getElementById("search-input");
  var regionSelect = document.getElementById("region-select");
  var loader = document.getElementById("countries-loader");
  var grid = document.getElementById("countries-grid");
  var emptyState = document.getElementById("countries-empty");
  var errorState = document.getElementById("countries-error");
  var resultsCount = document.getElementById("results-count");

  var state = {
    countries: [],
  };

  function hideFeedbackStates() {
    emptyState.hidden = true;
    errorState.hidden = true;
  }

  function updateResultsCounter(count) {
    if (count === 1) {
      resultsCount.textContent = "1 country found";
      return;
    }

    resultsCount.textContent = count + " countries found";
  }

  function filterCountries() {
    var query = searchInput.value.trim().toLowerCase();
    var regionValue = regionSelect.value.toLowerCase();

    return state.countries.filter(function (country) {
      var matchesRegion =
        regionValue === "all" || country.region.toLowerCase() === regionValue;

      var searchTarget = [
        country.name,
        country.officialName,
        country.capital,
        country.region,
        country.subregion,
        helpers.formatList(country.continents),
      ]
        .join(" ")
        .toLowerCase();

      var matchesQuery = searchTarget.includes(query);

      return matchesRegion && matchesQuery;
    });
  }

  function renderCountries() {
    var filteredCountries = filterCountries();
    grid.innerHTML = "";
    hideFeedbackStates();

    updateResultsCounter(filteredCountries.length);

    if (filteredCountries.length === 0) {
      grid.hidden = true;
      emptyState.hidden = false;
      return;
    }

    filteredCountries.forEach(function (country) {
      grid.appendChild(ui.createCountryCard(country));
    });

    grid.hidden = false;
  }

  function handleFilterChange() {
    renderCountries();
  }

  async function loadCountries() {
    loader.hidden = false;
    grid.hidden = true;
    hideFeedbackStates();

    try {
      var response = await api.getAllCountries();
      state.countries = response
        .map(helpers.normalizeCountry)
        .sort(function (firstCountry, secondCountry) {
          return firstCountry.name.localeCompare(secondCountry.name);
        });

      renderCountries();
    } catch (error) {
      resultsCount.textContent = "Unable to load countries";
      errorState.hidden = false;
    } finally {
      loader.hidden = true;
    }
  }

  searchInput.addEventListener("input", handleFilterChange);
  regionSelect.addEventListener("change", handleFilterChange);
  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
  });

  loadCountries();
})();
