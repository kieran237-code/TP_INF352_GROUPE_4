
const modalContainer= document.querySelector(".modal-container");
const modalTriggers = document.querySelectorAll(".modal-trigger");

modalTriggers.forEach(trigger => trigger.addEventListener("click",toggleModal))

function toggleModal(){
  modalContainer.classList.toggle("active");
}
// Fonction utilitaire pour décoder un JWT côté client
function decodeJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Erreur lors du décodage du JWT :", e);
        return null;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const accessToken = localStorage.getItem('accessToken');
    // const accessTokenDisplay = document.getElementById('accessTokenDisplay');
    const userNameDisplay = document.getElementById('user-name');

    if (!accessToken) {
        alert("Vous n'êtes pas connecté. Veuillez vous connecter.");
        window.location.href = 'login.html';
    } else {
        // accessTokenDisplay.textContent = accessToken;

        const decodedToken = decodeJwt(accessToken);
        if (decodedToken && decodedToken.name) {
            userNameDisplay.textContent = decodedToken.name;
        } else {
            userNameDisplay.textContent = 'Utilisateur Inconnu';
        }
    }

    // Gérer le bouton de déconnexion
    document.getElementById('logout-btn').addEventListener('click', function() {
        localStorage.removeItem('accessToken');
        window.location.href = 'login.html';
    });

    // La logique de chargement de données protégées a été supprimée d'ici
});




function generateVehicleTableHTML(data) {
  const vehicles = Array.isArray(data) ? data : [data];

  const style = `<style>
.vehicle-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 0;
}
.vehicle-table th, .vehicle-table td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: left;
}
.vehicle-table th {
  background-color: #f4f4f4;
}
.vehicle-table tr:nth-child(even) {
  background-color: #fafafa;
}
</style>`;

  const headers = `<thead><tr>
  <th>Registration</th>
  <th>Model</th>
  <th>Make</th>
  <th>Year</th>
  <th>Rental Price</th>
</tr></thead>`;

  const rows = vehicles.map(v => `<tr>
  <td>${v.registration}</td>
  <td>${v.model}</td>
  <td>${v.make}</td>
  <td>${v.year}</td>
  <td>${v.rentalPrice} €</td>
</tr>`).join('');

  return `${style}<table class="vehicle-table">${headers}<tbody>${rows}</tbody></table>`;
}

const result_container=document.getElementById("result-container");
const get_all=document.getElementById("GET_ALL");
const title_request=document.getElementById("title-request");

const read_all = async () => {
  title_request.innerHTML = "<strong>Requête : </strong>Listes des vehicules disponibles.";

  const requestString = 'http://localhost:3000/vehicules/';
  
  try {
    const response = await fetch(requestString);

    if (!response.ok) {
      // Si le serveur répond avec un code d'erreur HTTP
      result_container.innerHTML = `<h3>Erreur lors de la récupération des véhicules : ${response.status} ${response.statusText}</h3>`;
      console.error('Erreur HTTP:', response.status, response.statusText);
      return;
    }

    const data = await response.json();
    console.log(data);

    if (!Array.isArray(data) || data.length === 0) {
      result_container.innerHTML = `<h3>Liste vide.</h3>`;
    } else {
      result_container.innerHTML = generateVehicleTableHTML(data);
    }

  } catch (error) {
    // En cas d'erreur réseau, JSON invalide, etc.
    result_container.innerHTML = `<h3>Erreur de connexion ou données invalides.</h3>`;
    console.error('Erreur fetch:', error);
  }
};

get_all.addEventListener("click", read_all);

// part2 les modals


// Cibler les éléments importants

const overlay = document.querySelector('.overlay');
const closeButtons = document.querySelectorAll('.modal-trigger');
const modalForm = document.getElementById('modal-form');
const methodButtons = document.querySelectorAll('.method-btn');

// Fonction pour ouvrir la modale avec un formulaire adapté
function showModal(method) {
  modalContainer.classList.add('active');

  // Génère dynamiquement le contenu du formulaire selon la méthode
  let formContent = `
    <div class="top">
      <h3>${method}</h3>
      <span class="close-modal modal-trigger">X</span>
    </div>
  `;

  if (method === 'GET') {
    formContent += `
      <div class="form-group">
        <label>Immatriculation du véhicule à rechercher <span>*</span></label>
        <input type="text" name="registration" placeholder="AA123BB" required>
      </div>
    `;
  } else if (method === 'POST') {
    formContent += `
    <div class="form-group">
      <label>Immatriculation <span>*</span></label>
      <input type="text" name="registration" placeholder="AA123BB" required>
    </div>
    <div class="form-group">
      <label>Marque <span>*</span></label>
      <input type="text" name="make" placeholder="Peugeot" required>
    </div>
    <div class="form-group">
      <label>Modèle <span>*</span></label>
      <input type="text" name="model" placeholder="208" required>
    </div>
    <div class="form-group">
      <label>Année <span>*</span></label>
      <input type="number" name="year" min="1600" max="2025" placeholder="2020" required>
    </div>
    <div class="form-group">
      <label>Prix de location <span>*</span></label>
      <input type="number" name="rentalPrice" min="0" max="50000" placeholder="15000" required>
    </div>
  `;
  } else if (method === 'PUT') {
      formContent += `
      <div class="form-group">
        <label>Immatriculation du véhicule à modifier <span>*</span></label>
        <input type="text" name="registration" placeholder="AA123BB" required>
      </div>
      <div class="form-group">
        <label>Nouvelle marque</label>
        <input type="text" name="make" placeholder="Peugeot">
      </div>
      <div class="form-group">
        <label>Nouveau modèle</label>
        <input type="text" name="model" placeholder="208">
      </div>
      <div class="form-group">
        <label>Nouvelle année</label>
        <input type="number" name="year" min="1600" max="2025" placeholder="2020">
      </div>
      <div class="form-group">
        <label>Nouveau prix de location</label>
        <input type="number" name="rentalPrice" min="0" max="50000" placeholder="15000">
      </div>
  `;
  } else if (method === 'DELETE') {
    formContent += `
      <div class="form-group">
        <label>Immatriculation du véhicule à supprimer <span>*</span></label>
        <input type="text" name="id" placeholder="3" required>
      </div>
    `;
  } else if (method === 'GET BY PRICE') {
  formContent += `
    <div class="form-group">
      <label>Prix minimum</label>
      <input type="number" name="min" placeholder="0" min="0" max ="50000000">
    </div>
    <div class="form-group">
      <label>Prix maximum</label>
      <input type="number" name="max" placeholder="50000000" min="0" >
    </div>
  `;
}

  formContent += `
    <div class="buttons">
      <button type="button" class="modal-trigger">Annuler</button>
      <button type="submit">${method}</button>
    </div>
  `;

  // Injecter dans le formulaire sans toucher à la structure extérieure
  modalForm.innerHTML = formContent;
}

// Fonction pour fermer la modale
function closeModal() {
  modalContainer.classList.remove('active');
}

// Gestion des clics sur boutons méthodes (GET, POST, etc.)
methodButtons.forEach(button => {
  button.addEventListener('click', () => {
    const method = button.innerText.trim();
    if (['GET','GET BY PRICE', 'POST', 'PUT', 'DELETE'].includes(method)) {
      showModal(method);
    }
  });
});

// Gestion du clic sur overlay ou bouton Annuler
modalContainer.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-trigger') || e.target === overlay) {
    closeModal();
  }
});

// Gestion de la soumission
modalForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = Object.fromEntries(new FormData(modalForm));
  const method = modalForm.querySelector('button[type="submit"]').innerText.trim();

  if (method === 'GET BY PRICE') {
    const min = data.min || 0;
    const max = data.max || 999999;

    title_request.innerHTML = `<strong>Requête : </strong>Véhicules entre ${min}€ et ${max}€.`;

    fetch(`http://localhost:3000/vehicules/prix?min=${min}&max=${max}`)
      .then(res => res.json())
      .then(data => {
        if (!Array.isArray(data) || data.length === 0) {
          result_container.innerHTML = `<h3>Aucun véhicule trouvé dans cette tranche de prix.</h3>`;
        } else {
          result_container.innerHTML = generateVehicleTableHTML(data);
        }
        closeModal(); // on le met ici une fois la requête terminée
      })
      .catch(err => {
        console.error('Erreur GET BY PRICE:', err);
        result_container.innerHTML = `<h3>Erreur de récupération par prix.</h3>`;
        closeModal(); // on ferme aussi en cas d'erreur
      });

    return;
  }

  if (method === 'GET') {
    const reg = data.registration;

    title_request.innerHTML = `<strong>Requête : </strong>Véhicule avec immatriculation ${reg}.`;

    fetch(`http://localhost:3000/vehicules/${reg}`)
      .then(res => res.json())
      .then(vehicle => {
        if (!vehicle || vehicle.error) {
          result_container.innerHTML = `<h3>Véhicule non trouvé.</h3>`;
        } else {
          result_container.innerHTML = generateVehicleTableHTML(vehicle);
        }
        closeModal(); // fermeture une fois la requête terminée
      })
      .catch(err => {
        console.error('Erreur GET BY REGISTRATION:', err);
        result_container.innerHTML = `<h3>Erreur de récupération du véhicule.</h3>`;
        closeModal(); // fermeture aussi en cas d’erreur
      });

    return;
  }


  if (method === 'POST') {
    title_request.innerHTML = `<strong>Requête : </strong>Ajout d'un nouveau véhicule.`

    const accessToken = localStorage.getItem('accessToken');

    fetch('http://localhost:3000/vehicules/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(data)
    })
    .then(res => {
      if (!res.ok) {
        return res.json().then(err => {
          throw new Error(err.message || `Erreur serveur : ${res.status}`);
        });
      }
      return res.json();
    })
    .then(vehicle => {
      result_container.innerHTML = `<h3>Véhicule ajouté avec succès.</h3>` + generateVehicleTableHTML(vehicle);
      closeModal();
    })
    .catch(err => {
      console.error('Erreur POST:', err);
      result_container.innerHTML = `<h3>Erreur lors de l'ajout : ${err.message}</h3>`;
      closeModal();
    });

    return;
  }

  if (method === 'DELETE') {
    const reg = data.id;
    title_request.innerHTML = `<strong>Requête : </strong>Suppression du véhicule ${reg}`;

    const accessToken = localStorage.getItem('accessToken');

    fetch(`http://localhost:3000/vehicules/${reg}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
    .then(res => {
      if (res.status === 204) {
        result_container.innerHTML = `<h3>Véhicule supprimé avec succès.</h3>`;
        closeModal();
      } else if (res.status === 404) {
        result_container.innerHTML = `<h3>Véhicule non trouvé.</h3>`;
        closeModal();
      } else {
        return res.json().then(err => {
          throw new Error(err.message || 'Erreur lors de la suppression');
        });
      }
    })
    .catch(err => {
      console.error('Erreur DELETE:', err);
      result_container.innerHTML = `<h3>Erreur : ${err.message}</h3>`;
      closeModal();
    });

    return;
  }
  
  if (method === 'PUT') {
    const reg = data.registration;
    title_request.innerHTML = `<strong>Requête : </strong>Mise à jour du véhicule ${reg}`;

    const accessToken = localStorage.getItem('accessToken');

    fetch(`http://localhost:3000/vehicules/${reg}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(data)
    })
    .then(res => {
      if (!res.ok) {
        return res.json().then(err => {
          throw new Error(err.message || `Erreur serveur : ${res.status}`);
        });
      }
      return res.json();
    })
    .then(updatedVehicle => {
      result_container.innerHTML = `<h3>Véhicule mis à jour avec succès.</h3>` + generateVehicleTableHTML(updatedVehicle);
      closeModal();
    })
    .catch(err => {
      console.error('Erreur PUT:', err);
      result_container.innerHTML = `<h3>Erreur lors de la mise à jour : ${err.message}</h3>`;
      closeModal();
    });

    return;
  }


  console.log('Données envoyées :', data);
  closeModal(); 
});

