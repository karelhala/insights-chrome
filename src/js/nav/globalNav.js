export const options = Object.freeze([{
    id: 'dashboard',
    title: 'Dashboard'
}, {
    id: 'advisor',
    title: 'Advisor'
}, {
    id: 'security',
    title: 'Security'
}, {
    id: 'compliance',
    title: 'Compliance'
}, {
    id: 'cmaas',
    title: 'Cost Management'
}, {
    id: 'inventory',
    title: 'Inventory'
}, {
    id: 'reports',
    title: 'Reports'
}, {
    id: 'settings',
    title: 'Settings'
}]);

function toNavElement(item) {
    const li = document.createElement('li');
    li.setAttribute('id', item.id);
    if (item.active) {
        li.classList.add('active');
    }

    const span = document.createElement('span');
    span.textContent = item.title;

    li.appendChild(span);

    return li;
}

export function render (state = options) {
    const ul = document.getElementById('navigation');
    ul.innerHTML = '';
    state.map(toNavElement).forEach(item => ul.appendChild(item));
}

// temporary fallback for apps that do not use the chrome API yet
document.addEventListener('DOMContentLoaded', () => !window.insights.chrome.on && render());
