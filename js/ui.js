import { saveToLocalStorage } from './storage.js';
import { showModal } from './modal.js';

export function renderStudyPlan(plan, modulesContainer) {
    modulesContainer.innerHTML = '';

    if (plan.length === 0) {
        const addModuleButton = document.createElement('button');
        addModuleButton.textContent = 'Adicionar Módulo';
        addModuleButton.className = 'button-add-module';
        addModuleButton.addEventListener('click', () => {
            const newModule = {
                modulo: `Novo Módulo 1`,
                semanas: [],
            };
            plan.push(newModule);
            saveToLocalStorage('studyPlan', plan);
            renderStudyPlan(plan, modulesContainer);
        });

        modulesContainer.appendChild(addModuleButton);
        return;
    }

    plan.forEach((module, moduleIndex) => {
        const moduleDiv = document.createElement('div');
        moduleDiv.className = 'module';

        // Cabeçalho do módulo
        const titleDiv = document.createElement('div');
        titleDiv.className = 'module-header';

        const title = document.createElement('h2');
        title.textContent = module.modulo;
        title.contentEditable = false;

        const renameButton = document.createElement('button');
        renameButton.textContent = 'Renomear Título';
        renameButton.className = 'button-rename';
        renameButton.addEventListener('click', () => {
            if (renameButton.textContent === 'Renomear Título') {
                title.contentEditable = true;
                title.focus();
                renameButton.textContent = 'Aplicar';
            } else {
                title.contentEditable = false;
                module.modulo = title.textContent.trim();
                saveToLocalStorage('studyPlan', plan);
                renderStudyPlan(plan, modulesContainer);
            }
        });

        const removeModuleButton = document.createElement('button');
        removeModuleButton.textContent = 'Remover Campo';
        removeModuleButton.className = 'button-remove-module';
        removeModuleButton.addEventListener('click', () => {
            showModal('Você tem certeza que deseja remover este módulo inteiro?', (confirmed) => {
                if (confirmed) {
                    plan.splice(moduleIndex, 1);
                    saveToLocalStorage('studyPlan', plan);
                    renderStudyPlan(plan, modulesContainer);
                }
            });
        });

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container';
        buttonContainer.appendChild(renameButton);
        buttonContainer.appendChild(removeModuleButton);

        titleDiv.appendChild(title);
        titleDiv.appendChild(buttonContainer);
        moduleDiv.appendChild(titleDiv);

        // Adicionar semanas e listas
        module.semanas.forEach((semana, semanaIndex) => {
            const semanaDiv = document.createElement('div');
            semanaDiv.className = 'semana';

            const semanaHeader = document.createElement('div');
            semanaHeader.className = 'semana-header';

            const semanaTitle = document.createElement('h3');
            semanaTitle.textContent = `Semana ${semanaIndex + 1}`;

            // Botão para abrir o modal de controle
            const openControlModalButton = document.createElement('button');
            openControlModalButton.textContent = 'Abrir Controle';
            openControlModalButton.className = 'button-control';
            openControlModalButton.addEventListener('click', () => {
                openControlModal(plan, moduleIndex, semanaIndex, modulesContainer);
            });

            semanaHeader.appendChild(semanaTitle);
            semanaHeader.appendChild(openControlModalButton);
            semanaDiv.appendChild(semanaHeader);

            const semanaContent = document.createElement('div');
            semanaContent.className = 'semana-content';

            semana.dias.forEach((dia) => {
                const diaDiv = document.createElement('div');
                diaDiv.className = 'dia';
                diaDiv.innerHTML = `
                    <span>${dia.dia}: ${dia.descricao}</span>
                    <input type="checkbox" ${dia.completado ? 'checked' : ''}>
                `;

                semanaContent.appendChild(diaDiv);
            });

            semanaDiv.appendChild(semanaContent);
            moduleDiv.appendChild(semanaDiv);
        });

        // Botão para adicionar nova semana
        const addWeekButton = document.createElement('button');
        addWeekButton.className = 'button-add-week';
        addWeekButton.textContent = 'Adicionar Semana';
        addWeekButton.addEventListener('click', () => {
            const newWeek = {
                semana: module.semanas.length + 1,
                dias: [],
            };
            module.semanas.push(newWeek);
            saveToLocalStorage('studyPlan', plan);
            renderStudyPlan(plan, modulesContainer);
        });

        moduleDiv.appendChild(addWeekButton);
        modulesContainer.appendChild(moduleDiv);
    });

    // Botão para adicionar novo módulo
    const addModuleButton = document.createElement('button');
    addModuleButton.textContent = 'Adicionar Módulo';
    addModuleButton.className = 'button-add-module';
    addModuleButton.addEventListener('click', () => {
        const newModule = {
            modulo: `Novo Módulo ${plan.length + 1}`,
            semanas: [],
        };
        plan.push(newModule);
        saveToLocalStorage('studyPlan', plan);
        renderStudyPlan(plan, modulesContainer);
    });

    modulesContainer.appendChild(addModuleButton);
}

// Função para abrir o modal de controle
function openControlModal(plan, moduleIndex, semanaIndex, modulesContainer) {
    const modal = document.getElementById('control-modal');
    const modalContent = document.getElementById('control-modal-content');
    modal.style.display = 'block';

    // Resetar o conteúdo do modal
    modalContent.innerHTML = `
        <h3>Controle da Semana ${semanaIndex + 1}</h3>
        <button class="button-add-list">Adicionar Lista</button>
        <button class="button-remove-all">Remover Todas as Listas</button>
        <button class="button-add-week">Adicionar Semana</button>
        <div class="list-control">
            <h4>Listas Existentes</h4>
            <ul id="list-items"></ul>
        </div>
    `;

    const listItems = modalContent.querySelector('#list-items');
    const semana = plan[moduleIndex].semanas[semanaIndex];

    // Função para renderizar as listas existentes
    function renderListItems() {
        listItems.innerHTML = '';
        semana.dias.forEach((dia, diaIndex) => {
            const listItem = document.createElement('li');
            listItem.className = 'list-item';
            listItem.innerHTML = `
                <span>${dia.dia}: ${dia.descricao}</span>
                <button class="button-remove-list" data-dia-index="${diaIndex}">Remover</button>
            `;

            // Adicionar funcionalidade de remover lista
            listItem.querySelector('.button-remove-list').addEventListener('click', (e) => {
                const indexToRemove = e.target.getAttribute('data-dia-index');
                semana.dias.splice(indexToRemove, 1);
                saveToLocalStorage('studyPlan', plan);
                renderListItems(); // Atualiza as listas no modal em tempo real
            });

            listItems.appendChild(listItem);
        });
    }

    // Renderizar as listas inicialmente
    renderListItems();

    // Adicionar funcionalidade ao botão "Adicionar Lista"
    const addListButton = modalContent.querySelector('.button-add-list');
    addListButton.addEventListener('click', () => {
        const existingInput = modalContent.querySelector('.list-input-group');
        if (existingInput) existingInput.remove();

        const inputGroup = document.createElement('div');
        inputGroup.className = 'list-input-group';
        inputGroup.innerHTML = `
            <input type="text" class="list-input" placeholder="Digite a descrição da nova lista" />
            <button class="button-apply-list">Aplicar</button>
        `;

        modalContent.appendChild(inputGroup);

        const applyButton = inputGroup.querySelector('.button-apply-list');
        applyButton.addEventListener('click', () => {
            const inputField = inputGroup.querySelector('.list-input');
            const taskDescription = inputField.value.trim();
            if (taskDescription) {
                const newTask = {
                    dia: `Dia ${semana.dias.length + 1}`,
                    descricao: taskDescription,
                    completado: false,
                };
                semana.dias.push(newTask);
                saveToLocalStorage('studyPlan', plan);
                renderListItems(); // Atualiza as listas no modal em tempo real
                inputField.value = ''; // Limpa o campo de entrada após adicionar
            } else {
                alert('Por favor, insira uma descrição válida.');
            }
        });
    });

    // Adicionar funcionalidade ao botão "Remover Todas as Listas"
    const removeAllButton = modalContent.querySelector('.button-remove-all');
    removeAllButton.addEventListener('click', () => {
        semana.dias = [];
        saveToLocalStorage('studyPlan', plan);
        renderListItems(); // Atualiza as listas no modal em tempo real
    });

    // Adicionar funcionalidade ao botão "Adicionar Semana"
    const addWeekButton = modalContent.querySelector('.button-add-week');
    addWeekButton.addEventListener('click', () => {
        const newWeek = { semana: plan[moduleIndex].semanas.length + 1, dias: [] };
        plan[moduleIndex].semanas.push(newWeek);
        saveToLocalStorage('studyPlan', plan);
        renderStudyPlan(plan, modulesContainer);
        modal.style.display = 'none';
    });

    // Botão para fechar o modal e atualizar o gerenciador de tarefas
    const closeModal = document.createElement('button');
    closeModal.textContent = 'Fechar Modal e Atualizar';
    closeModal.className = 'button-close-modal';
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
        renderStudyPlan(plan, modulesContainer); // Atualiza o gerenciador de tarefas
    });
    modalContent.appendChild(closeModal);
}
