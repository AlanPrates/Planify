export function showModal(message, callback) {
    const modal = document.getElementById('custom-modal');
    const modalMessage = document.getElementById('modal-message');
    const closeModal = document.getElementById('close-modal');
    const okButton = document.getElementById('modal-ok-btn');
    const cancelButton = document.getElementById('modal-cancel-btn');

    modalMessage.textContent = message;
    modal.style.display = 'block';

    okButton.onclick = () => {
        modal.style.display = 'none';
        if (callback) callback(true);
    };

    cancelButton.onclick = () => {
        modal.style.display = 'none';
        if (callback) callback(false);
    };

    closeModal.onclick = () => {
        modal.style.display = 'none';
        if (callback) callback(false);
    };

    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
            if (callback) callback(false);
        }
    };
}
