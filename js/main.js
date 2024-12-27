import { loadFromLocalStorage, clearLocalStorage } from './storage.js';
import { renderStudyPlan } from './ui.js';
import { showModal } from './modal.js';

document.addEventListener('DOMContentLoaded', () => {
    const modulesContainer = document.getElementById('modules');
    const clearStorageButton = document.getElementById('clear-storage');
    const studyPlan = loadFromLocalStorage('studyPlan');

    renderStudyPlan(studyPlan, modulesContainer);

    clearStorageButton.addEventListener('click', () => {
        showModal('Você tem certeza que deseja limpar todo o progresso?', (confirmed) => {
            if (confirmed) {
                clearLocalStorage('studyPlan');
                renderStudyPlan([], modulesContainer); // Re-renderiza vazio com o botão "Adicionar Módulo"
            }
        });
    });
});
