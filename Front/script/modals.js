// // Cibler les éléments importants
// const modalContainer = document.querySelector('.modal-container');
// const overlay = document.querySelector('.overlay');
// const closeButtons = document.querySelectorAll('.modal-trigger');
// const modalForm = document.getElementById('modal-form');
// const methodButtons = document.querySelectorAll('.method-btn');

// // Fonction pour ouvrir la modale avec un formulaire adapté
// function showModal(method) {
//   modalContainer.classList.add('active');

//   // Génère dynamiquement le contenu du formulaire selon la méthode
//   let formContent = `
//     <div class="top">
//       <h3>${method} un véhicule</h3>
//       <span class="close-modal modal-trigger">X</span>
//     </div>
//   `;

//   if (method === 'GET') {
//     formContent += `
//       <div class="form-group">
//         <label>Numéro d'immatriculation <span>*</span></label>
//         <input type="text" name="registration" placeholder="AA123BB">
//       </div>
//     `;
//   } else if (method === 'POST') {
//     formContent += `
//       <div class="form-group">
//         <label>Modèle <span>*</span></label>
//         <input type="text" name="model" placeholder="Peugeot 208">
//       </div>
//       <div class="form-group">
//         <label>Prix <span>*</span></label>
//         <input type="number" name="price" placeholder="15000">
//       </div>
//     `;
//   } else if (method === 'PUT') {
//     formContent += `
//       <div class="form-group">
//         <label>ID du véhicule à modifier <span>*</span></label>
//         <input type="text" name="id" placeholder="3">
//       </div>
//       <div class="form-group">
//         <label>Nouveau modèle</label>
//         <input type="text" name="model">
//       </div>
//       <div class="form-group">
//         <label>Nouveau prix</label>
//         <input type="number" name="price">
//       </div>
//     `;
//   } else if (method === 'DELETE') {
//     formContent += `
//       <div class="form-group">
//         <label>ID du véhicule à supprimer <span>*</span></label>
//         <input type="text" name="id" placeholder="3">
//       </div>
//     `;
//   }

//   formContent += `
//     <div class="buttons">
//       <button type="button" class="modal-trigger">Annuler</button>
//       <button type="submit">${method}</button>
//     </div>
//   `;

//   // Injecter dans le formulaire sans toucher à la structure extérieure
//   modalForm.innerHTML = formContent;
// }

// // Fonction pour fermer la modale
// function closeModal() {
//   modalContainer.classList.remove('active');
// }

// // Gestion des clics sur boutons méthodes (GET, POST, etc.)
// methodButtons.forEach(button => {
//   button.addEventListener('click', () => {
//     const method = button.innerText.trim();
//     if (['GET', 'POST', 'PUT', 'DELETE'].includes(method)) {
//       showModal(method);
//     }
//   });
// });

// // Gestion du clic sur overlay ou bouton Annuler
// modalContainer.addEventListener('click', (e) => {
//   if (e.target.classList.contains('modal-trigger') || e.target === overlay) {
//     closeModal();
//   }
// });

// // Gestion de la soumission
// modalForm.addEventListener('submit', (e) => {
//   e.preventDefault();
//   const data = Object.fromEntries(new FormData(modalForm));
//   console.log('Données envoyées :', data);
//   closeModal();
// });
