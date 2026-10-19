(() => {
  const data = REALLMS_DATA;
  const modelSearch = document.querySelector('#model-search');
  const recipeSelect = document.querySelector('#recipe-select');
  const catalogButtons = document.querySelectorAll('[data-catalog="chat"], [data-catalog="api"]');
  let catalogView = 'chat';
  let copyTimer;

  function renderModels() {
    const query = modelSearch.value.trim().toLowerCase();
    const all = catalogView === 'chat' ? data.chatModels : data.apiModels;
    const models = all.filter(model => `${model.name} ${model.id} ${model.type} ${(model.endpoints || []).join(' ')}`.toLowerCase().includes(query));
    const rows = document.querySelector('#model-rows');
    rows.replaceChildren();
    for (const model of models) {
      const row = document.createElement('tr');
      const nameCell = row.insertCell();
      const name = document.createElement('span');
      name.className = 'model-name';
      name.textContent = model.name;
      nameCell.append(name);
      if (catalogView === 'api') {
        const id = document.createElement('code');
        id.className = 'model-id';
        id.textContent = model.id;
        nameCell.append(id);
      }
      const type = document.createElement('span');
      type.className = 'type-label';
      type.dataset.kind = model.kind;
      type.textContent = model.type;
      row.insertCell().append(type);
      const detail = row.insertCell();
      if (catalogView === 'chat') {
        detail.className = 'chat-location';
        detail.textContent = 'Web Chat (KB-listed)';
      } else if (model.endpoints.length) {
        for (const endpoint of model.endpoints) {
          const code = document.createElement('code');
          code.className = 'endpoint';
          code.textContent = endpoint;
          detail.append(code);
        }
      } else {
        detail.className = 'chat-location';
        detail.textContent = 'Endpoint not yet verified';
      }
      rows.append(row);
    }
    if (!models.length) {
      const row = document.createElement('tr');
      const cell = row.insertCell();
      cell.colSpan = 3;
      cell.className = 'empty-cell';
      cell.textContent = 'No matching models. Try a different name or capability.';
      rows.append(row);
    }
    document.querySelector('#model-count').textContent = `${models.length} of ${all.length} models shown`;
    document.querySelector('#detail-heading').textContent = catalogView === 'chat' ? 'Where to use it' : 'API endpoint';
    document.querySelector('#api-base').hidden = catalogView !== 'api';
    document.querySelector('#catalog-source').textContent = catalogView === 'chat'
      ? 'Listed in the Chat KB. Live Chat availability has not been checked and may differ from the API catalog.'
      : `Production API discovery checked ${data.checked}. Model IDs are from the configured production connection, not the development service.`;
    catalogButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.catalog === catalogView)));
  }

  function renderRecipe() {
    const recipe = data.recipes[recipeSelect.value];
    for (const field of ['intro', 'file', 'code', 'setup', 'check']) {
      document.querySelector(`#recipe-${field}`).textContent = recipe[field];
    }
    document.querySelector('#recipe-docs').href = recipe.docs;
  }
  recipeSelect.addEventListener('change', renderRecipe);
  renderRecipe();
  document.querySelector('.recipe-controls').hidden = false;
  document.querySelector('#recipe-content').hidden = false;

  for (const button of document.querySelectorAll('[data-copy]')) {
    button.addEventListener('click', async () => {
      const status = document.querySelector('#copy-status');
      clearTimeout(copyTimer);
      status.textContent = '';
      try {
        await navigator.clipboard.writeText(document.getElementById(button.dataset.copy).textContent);
        status.textContent = 'Copied. Ready for your next step.';
      } catch {
        status.textContent = 'Copy unavailable here. Select the example text and copy it manually.';
      }
      clearTimeout(copyTimer);
      copyTimer = setTimeout(() => { status.textContent = ''; }, 5500);
    });
    button.hidden = false;
  }
  catalogButtons.forEach(button => button.addEventListener('click', () => {
    catalogView = button.dataset.catalog;
    modelSearch.value = '';
    renderModels();
  }));
  modelSearch.addEventListener('input', renderModels);
  renderModels();
  document.querySelector('#catalog').hidden = false;
})();
