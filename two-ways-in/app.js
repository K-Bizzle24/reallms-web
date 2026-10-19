(() => {
  const data = REALLMS_DATA;
  let catalogView = 'chat';
  let copyTimer;
  const guideTabs = [...document.querySelectorAll('[data-guide]')];
  const modelSearch = document.querySelector('#model-search');

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
      const cell = document.createElement('tr').insertCell();
      cell.colSpan = 3;
      cell.className = 'empty-cell';
      cell.textContent = 'No matching models. Try a different name or capability.';
      rows.append(cell.parentElement);
    }
    document.querySelector('#model-count').textContent = `${models.length} of ${all.length} models shown`;
    document.querySelector('#detail-heading').textContent = catalogView === 'chat' ? 'Where to use it' : 'API endpoint';
    document.querySelector('#api-base').hidden = catalogView !== 'api';
    document.querySelector('#catalog-source').textContent = catalogView === 'chat'
      ? 'Listed in the Chat KB. Live Chat availability has not been checked and may differ from the API catalog.'
      : `Production API discovery checked ${data.checked}. Model IDs are from the configured production connection, not the development service.`;
    document.querySelectorAll('[data-catalog]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.catalog === catalogView)));
  }

  function selectGuide(value) {
    for (const tab of guideTabs) {
      const selected = tab.dataset.guide === value;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      document.querySelector(`#guide-${tab.dataset.guide}`).hidden = !selected;
    }
    catalogView = value;
    modelSearch.value = '';
    renderModels();
    if (location.hash === '#guide-chat' || location.hash === '#guide-api') {
      history.replaceState(null, '', `#guide-${value}`);
    }
  }

  const tablist = document.querySelector('[data-tab-group="guides"]');
  tablist.setAttribute('role', 'tablist');
  tablist.hidden = false;
  for (const tab of guideTabs) {
    tab.setAttribute('role', 'tab');
    const panel = document.querySelector(`#guide-${tab.dataset.guide}`);
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tab.id);
    tab.addEventListener('click', () => selectGuide(tab.dataset.guide));
    tab.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? guideTabs[0] : event.key === 'End' ? guideTabs.at(-1) : guideTabs[1 - guideTabs.indexOf(tab)];
      selectGuide(next.dataset.guide);
      next.focus();
    });
  }
  document.querySelectorAll('[data-path]').forEach(link => link.addEventListener('click', event => {
    event.preventDefault();
    selectGuide(link.dataset.path);
    const panel = document.querySelector(`#guide-${link.dataset.path}`);
    panel.focus({ preventScroll: true });
    document.querySelector('#start').scrollIntoView();
    history.replaceState(null, '', `#guide-${link.dataset.path}`);
  }));

  function renderRecipe() {
    const recipe = data.recipes[document.querySelector('#recipe-select').value];
    document.querySelector('#recipe-file').textContent = recipe.file;
    document.querySelector('#recipe-intro').textContent = recipe.intro;
    document.querySelector('#recipe-code').textContent = recipe.code;
    document.querySelector('#recipe-setup').textContent = recipe.setup;
    document.querySelector('#recipe-check').textContent = recipe.check;
    document.querySelector('#recipe-docs').href = recipe.docs;
  }
  document.querySelector('#recipe-select').addEventListener('change', renderRecipe);
  document.querySelector('.recipe-controls').hidden = false;
  document.querySelector('#recipe-content').hidden = false;
  renderRecipe();

  for (const button of document.querySelectorAll('[data-copy]')) {
    button.hidden = false;
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
      copyTimer = setTimeout(() => { status.textContent = ''; }, 5500);
    });
  }
  document.querySelectorAll('[data-catalog]').forEach(button => button.addEventListener('click', () => {
    catalogView = button.dataset.catalog;
    modelSearch.value = '';
    renderModels();
  }));
  modelSearch.addEventListener('input', renderModels);
  document.querySelector('#catalog').hidden = false;
  selectGuide(location.hash === '#guide-api' ? 'api' : 'chat');
  window.addEventListener('hashchange', () => {
    if (location.hash === '#guide-api' || location.hash === '#guide-chat') selectGuide(location.hash.slice(7));
  });
})();
