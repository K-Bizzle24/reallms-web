(() => {
  const data = REALLMS_DATA;
  const routes = [...document.querySelectorAll('[data-connection]')];
  const panels = [...document.querySelectorAll('.connection-panel')];
  const search = document.querySelector('#model-search');
  const capabilityNames = { language: 'Text & code', document: 'Documents', transcription: 'Audio transcription', image: 'Image generation', embeddings: 'Embeddings', reranking: 'Reranking' };
  let catalogView = 'chat';
  let capability = '';
  let copyTimer;

  function selectConnection(id) {
    for (const panel of panels) panel.hidden = panel.id !== id;
    for (const link of routes) {
      if (link.dataset.connection === id) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    }
    document.querySelector('#api-access').hidden = id === 'web-chat';
  }

  function followHash(focus = false) {
    const panel = panels.find(item => `#${item.id}` === location.hash || (location.hash === '#api-access' && item.id === 'direct-api'));
    if (!panel) return;
    selectConnection(panel.id);
    if (focus) {
      // API links land at prerequisites, not below them at the recipe.
      const target = panel.id === 'web-chat' ? panel : document.querySelector('#api-access');
      target.scrollIntoView();
      target.focus({ preventScroll: true });
    }
  }

  for (const link of routes) link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    selectConnection(link.dataset.connection);
    if (location.hash !== link.hash) history.pushState(null, '', link.hash);
    followHash(true);
  });
  window.addEventListener('hashchange', () => followHash(true));
  document.querySelector('.connection-content').classList.add('enhanced');
  selectConnection('web-chat');
  followHash(true);

  function renderRecipe(container, key) {
    const recipe = data.recipes[key];
    const fragment = document.querySelector('#recipe-template').content.cloneNode(true);
    for (const field of ['intro', 'file', 'setup', 'check']) fragment.querySelector(`.recipe-${field}`).textContent = recipe[field];
    fragment.querySelector('code').textContent = recipe.code;
    fragment.querySelector('.recipe-docs').href = recipe.docs;
    fragment.querySelector('.copy-code').addEventListener('click', async () => {
      const status = document.querySelector('#copy-status');
      clearTimeout(copyTimer);
      status.textContent = '';
      try {
        await navigator.clipboard.writeText(recipe.code);
        status.textContent = 'Configuration copied.';
      } catch {
        status.textContent = 'Copy unavailable. Select and copy the code manually.';
      }
      copyTimer = setTimeout(() => { status.textContent = ''; }, 6000);
    });
    container.replaceChildren(fragment);
  }
  for (const container of document.querySelectorAll('[data-recipe]')) renderRecipe(container, container.dataset.recipe);
  document.querySelector('.terminal-control').hidden = false;
  document.querySelector('#terminal-select').addEventListener('change', event => renderRecipe(document.querySelector('#terminal [data-recipe]'), event.target.value));

  function renderModels() {
    const all = catalogView === 'chat' ? data.chatModels : data.apiModels;
    const query = search.value.trim().toLowerCase();
    const models = all.filter(model => (!capability || (capability === 'language' ? ['chat', 'coding'].includes(model.kind) : model.kind === capability)) && [model.name, model.id, model.type, ...(model.endpoints || [])].join(' ').toLowerCase().includes(query));
    const rows = document.querySelector('#model-rows');
    rows.replaceChildren();
    for (const model of models) {
      const row = document.createElement('tr');
      const name = document.createElement('strong');
      name.textContent = model.name;
      row.insertCell().append(name);
      if (catalogView === 'api') {
        const id = document.createElement('code');
        id.className = 'model-id';
        id.textContent = model.id;
        row.cells[0].append(id);
      }
      row.insertCell().textContent = model.type;
      const detail = row.insertCell();
      if (catalogView === 'chat') detail.textContent = 'Web Chat';
      else if (!model.endpoints.length) detail.textContent = 'Endpoint unverified';
      else for (const endpoint of model.endpoints) {
        const code = document.createElement('code');
        code.textContent = endpoint;
        detail.append(code);
      }
      rows.append(row);
    }
    if (!models.length) {
      const cell = rows.insertRow().insertCell();
      cell.colSpan = 3;
      cell.textContent = 'No matching models. Try another search or reset filters.';
    }
    document.querySelector('#catalog-caption').textContent = catalogView === 'chat' ? 'Web Chat models' : 'API models';
    document.querySelector('#detail-heading').textContent = catalogView === 'chat' ? 'Access' : 'API endpoint';
    document.querySelector('#catalog-source').textContent = catalogView === 'chat' ? `KB-listed / ${data.checked}. Not a live Chat inventory.` : `Production-discovered / ${data.checked}. Not a live availability check.`;
    document.querySelector('#api-base').hidden = catalogView !== 'api';
    document.querySelector('#model-count').textContent = `${models.length} of ${all.length} models shown`;
    const filter = document.querySelector('#capability-filter');
    filter.hidden = !capability;
    filter.textContent = capability ? `Capability: ${capabilityNames[capability]}. Showing API models; use Reset filters to see the full inventory.` : '';
    for (const button of document.querySelectorAll('[data-catalog]')) button.setAttribute('aria-pressed', String(button.dataset.catalog === catalogView));
  }
  search.addEventListener('input', renderModels);
  document.querySelector('#reset-models').addEventListener('click', () => {
    search.value = '';
    capability = '';
    renderModels();
  });
  for (const button of document.querySelectorAll('[data-catalog]')) button.addEventListener('click', () => {
    catalogView = button.dataset.catalog;
    search.value = '';
    capability = '';
    renderModels();
  });
  for (const link of document.querySelectorAll('[data-capability]')) link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    capability = link.dataset.capability;
    catalogView = 'api';
    search.value = '';
    renderModels();
    document.querySelector('#models').focus({ preventScroll: true });
  });
  document.querySelector('#catalog').hidden = false;
  renderModels();
})();
