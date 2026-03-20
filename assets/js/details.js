(function () {
  var api = window.CountryAtlasApi;
  var helpers = window.CountryAtlasHelpers;
  var ui = window.CountryAtlasUi;

  var loader = document.getElementById("details-loader");
  var errorState = document.getElementById("details-error");
  var detailsContainer = document.getElementById("country-details");

  function getSelectedCode() {
    var params = new URLSearchParams(window.location.search);
    return params.get("code");
  }

  function createInfoBlock(label, value) {
    var wrapper = document.createElement("div");
    var title = document.createElement("dt");
    var description = document.createElement("dd");

    title.textContent = label;
    description.textContent = value;

    wrapper.appendChild(title);
    wrapper.appendChild(description);

    return wrapper;
  }

  function renderDetails(country) {
    detailsContainer.innerHTML = "";

    var detailsCard = document.createElement("section");
    detailsCard.className = "details-card";

    var flagWrapper = document.createElement("div");
    flagWrapper.className = "details-flag";

    var flag = document.createElement("img");
    flag.src = country.flag;
    flag.alt = country.flagAlt || country.name + " flag";
    flagWrapper.appendChild(flag);

    var copy = document.createElement("div");
    copy.className = "details-copy";

    var regionChip = document.createElement("span");
    regionChip.className = "chip";
    regionChip.textContent = country.region;

    var title = document.createElement("h2");
    title.textContent = country.name;

    var description = document.createElement("p");
    description.textContent =
      "Official name: " +
      country.officialName + ".";

    var actions = document.createElement("div");
    actions.className = "details-actions";

    var favoriteButton = ui.createFavoriteButton(country);
    var backLink = document.createElement("a");
    backLink.className = "secondary-button";
    backLink.href = "./index.html";
    backLink.textContent = "Back to list";

    actions.appendChild(favoriteButton);
    actions.appendChild(backLink);

    copy.appendChild(regionChip);
    copy.appendChild(title);
    copy.appendChild(description);
    copy.appendChild(actions);

    detailsCard.appendChild(flagWrapper);
    detailsCard.appendChild(copy);

    var statsCard = document.createElement("aside");
    statsCard.className = "details-stats";

    var statsTitle = document.createElement("h3");
    statsTitle.textContent = "Key facts";

    var infoList = document.createElement("dl");
    infoList.className = "info-list";
    infoList.appendChild(createInfoBlock("Capital", country.capital));
    infoList.appendChild(
      createInfoBlock("Population", helpers.formatPopulation(country.population))
    );
    infoList.appendChild(
      createInfoBlock("Subregion", country.subregion || "Not available")
    );
    infoList.appendChild(
      createInfoBlock("Continents", helpers.formatList(country.continents))
    );
    infoList.appendChild(
      createInfoBlock("Languages", helpers.formatList(country.languages))
    );
    infoList.appendChild(
      createInfoBlock("Currencies", helpers.formatList(country.currencies))
    );
    infoList.appendChild(createInfoBlock("Area", helpers.formatArea(country.area)));
    infoList.appendChild(
      createInfoBlock("Timezones", helpers.formatList(country.timezones))
    );
    infoList.appendChild(
      createInfoBlock(
        "Borders",
        country.borders.length > 0 ? country.borders.join(", ") : "None"
      )
    );
    infoList.appendChild(
      createInfoBlock(
        "Independent",
        country.independent === null ? "Not available" : country.independent ? "Yes" : "No"
      )
    );

    if (country.mapsLink) {
      infoList.appendChild(createInfoBlock("Maps", "Open in Google Maps"));

      var mapWrapper = infoList.lastElementChild;
      var mapText = mapWrapper.querySelector("dd");
      mapText.textContent = "";

      var mapLink = document.createElement("a");
      mapLink.className = "details-link";
      mapLink.href = country.mapsLink;
      mapLink.target = "_blank";
      mapLink.rel = "noreferrer noopener";
      mapLink.textContent = "Open in Google Maps";

      mapText.appendChild(mapLink);
    }

    statsCard.appendChild(statsTitle);
    statsCard.appendChild(infoList);

    detailsContainer.appendChild(detailsCard);
    detailsContainer.appendChild(statsCard);
    detailsContainer.hidden = false;
  }

  async function loadDetails() {
    var code = getSelectedCode();

    if (!code) {
      loader.hidden = true;
      errorState.hidden = false;
      return;
    }

    try {
      var response = await api.getCountryByCode(code);
      renderDetails(helpers.normalizeCountry(response));
    } catch (error) {
      errorState.hidden = false;
    } finally {
      loader.hidden = true;
    }
  }

  loadDetails();
})();
