(function () {
  var storage = window.CountryAtlasStorage;
  var helpers = window.CountryAtlasHelpers;

  function setFavoriteButtonState(button, isActive) {
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
    button.textContent = isActive ? "Remove favorite" : "Save as favorite";
  }

  function createFavoriteButton(country, onToggle) {
    var button = document.createElement("button");
    button.type = "button";
    button.className = "favorite-button";

    setFavoriteButtonState(button, storage.isFavorite(country.code));

    button.addEventListener("click", function () {
      var isNowFavorite = storage.toggleFavorite(country);
      setFavoriteButtonState(button, isNowFavorite);

      if (typeof onToggle === "function") {
        onToggle(isNowFavorite);
      }
    });

    return button;
  }

  function createCardFact(label, value) {
    var row = document.createElement("div");
    row.className = "card-fact";

    var labelElement = document.createElement("span");
    labelElement.textContent = label;

    var valueElement = document.createElement("strong");
    valueElement.textContent = value;

    row.appendChild(labelElement);
    row.appendChild(valueElement);

    return row;
  }

  function createCountryCard(country, onFavoriteToggle) {
    var article = document.createElement("article");
    article.className = "country-card";

    var media = document.createElement("div");
    media.className = "country-card__media";

    var flag = document.createElement("img");
    flag.src = country.flag;
    flag.alt = country.flagAlt || country.name + " flag";
    flag.loading = "lazy";

    media.appendChild(flag);

    var body = document.createElement("div");
    body.className = "country-card__body";

    var header = document.createElement("div");
    header.className = "country-card__header";

    var title = document.createElement("h3");
    title.textContent = country.name;

    var regionChip = document.createElement("span");
    regionChip.className = "chip";
    regionChip.textContent = country.region;

    header.appendChild(title);
    header.appendChild(regionChip);

    var facts = document.createElement("div");
    facts.className = "card-facts";
    facts.appendChild(createCardFact("Capital", country.capital));
    facts.appendChild(
      createCardFact(
        "Population",
        helpers.formatPopulation(country.population),
      ),
    );
    facts.appendChild(
      createCardFact("Continent", helpers.formatList(country.continents)),
    );

    var actions = document.createElement("div");
    actions.className = "card-actions";

    var detailsLink = document.createElement("a");
    detailsLink.className = "primary-button";
    detailsLink.href = helpers.buildDetailsUrl(country.code);
    detailsLink.textContent = "View details";

    var favoriteButton = createFavoriteButton(country, onFavoriteToggle);

    actions.appendChild(detailsLink);
    actions.appendChild(favoriteButton);

    body.appendChild(header);
    body.appendChild(facts);
    body.appendChild(actions);

    article.appendChild(media);
    article.appendChild(body);

    return article;
  }

  window.CountryAtlasUi = {
    createCountryCard: createCountryCard,
    createFavoriteButton: createFavoriteButton,
  };
})();
