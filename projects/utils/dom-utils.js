export const addClickEventListener = (query, callback) => {
  const elements = getDomNodes(query);
  if (!elements) return;

  elements.forEach((element) => element.addEventListener('click', callback));
};

export const getDomNodes = (query) => document.querySelectorAll(query);
