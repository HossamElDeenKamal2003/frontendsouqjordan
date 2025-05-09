// src/utils/productFormStorage.js
export const saveProductForm = (data, expiryHours = 24) => {
    const expiry = Date.now() + (expiryHours * 60 * 60 * 1000);
    const payload = { data, expiry };
    localStorage.setItem('productForm', JSON.stringify(payload));
    console.log(payload);
};

export const getProductForm = () => {
    const item = localStorage.getItem('productForm');
    if (!item) return null;

    const { data, expiry } = JSON.parse(item);
    if (Date.now() > expiry) {
        localStorage.removeItem('productForm');
        return null;
    }
    return data;
};

export const clearProductForm = () => {
    localStorage.removeItem('productForm');
};