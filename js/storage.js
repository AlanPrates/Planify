export function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

export function loadFromLocalStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
}

export function clearLocalStorage(key) {
    localStorage.removeItem(key);
}
