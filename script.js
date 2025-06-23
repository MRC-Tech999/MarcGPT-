// script.js
document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileInput');
    const fileNameInput = document.getElementById('fileName');
    const commitMessageInput = document.getElementById('commitMessage');
    const uploadButton = document.getElementById('uploadButton');
    const statusMessage = document.getElementById('statusMessage');

    // !!! TRÈS IMPORTANT : NE PAS LAISSER CECI EN DUR POUR UN SITE PUBLIC !!!
    // Ces informations doivent être remplacées par les tiennes.
    const GITHUB_TOKEN = 'YOUR_PERSONAL_ACCESS_TOKEN'; // <<< REMPLACE CECI
    const REPO_OWNER = 'YOUR_GITHUB_USERNAME';         // <<< REMPLACE CECI
    const REPO_NAME = 'YOUR_REPO_NAME';                 // <<< REMPLACE CECI

    uploadButton.addEventListener('click', async () => {
        const file = fileInput.files[0];
        if (!file) {
            statusMessage.textContent = 'Veuillez sélectionner un fichier à envoyer.';
            statusMessage.className = 'error';
            return;
        }

        statusMessage.textContent = 'Envoi en cours...';
        statusMessage.className = ''; // Réinitialise le style

        const reader = new FileReader();
        reader.readAsDataURL(file); // Lit le fichier comme une URL de données (Base64)

        reader.onload = async () => {
            // Extrait le contenu Base64 (après la virgule)
            const base64Content = reader.result.split(',')[1];
            // Utilise le nom de fichier personnalisé si fourni, sinon le nom d'origine
            const filePath = fileNameInput.value.trim() || file.name;
            const commitMessage = commitMessageInput.value.trim();

            if (!commitMessage) {
                statusMessage.textContent = 'Veuillez entrer un message de commit.';
                statusMessage.className = 'error';
                return;
            }

            const apiUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}`;

            try {
                let sha = null;
                // Tente de récupérer le SHA si le fichier existe déjà (pour mise à jour)
                try {
                    const checkResponse = await fetch(apiUrl, {
                        headers: {
                            'Authorization': `token ${GITHUB_TOKEN}`,
                            'Accept': 'application/vnd.github.v3+json'
                        }
                    });
                    if (checkResponse.ok) {
                        const data = await checkResponse.json();
                        sha = data.sha; // Récupère le SHA du fichier existant
                    }
                } catch (error) {
                    console.warn("Impossible de vérifier l'existence du fichier ou de récupérer le SHA (probablement un nouveau fichier).", error);
                }

                const response = await fetch(apiUrl, {
                    method: 'PUT', // PUT est utilisé pour créer ou mettre à jour un fichier
                    headers: {
                        'Authorization': `token ${GITHUB_TOKEN}`,
                        'Accept': 'application/vnd.github.v3+json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        message: commitMessage,
                        content: base64Content,
                        sha: sha // Inclure le SHA si le fichier existe pour une mise à jour
                    })
                });

                if (response.ok) {
                    statusMessage.textContent = `Fichier "${filePath}" envoyé avec succès !`;
                    statusMessage.className = 'success';
                    // Optionnel: Réinitialiser les champs après succès
                    fileInput.value = '';
                    fileNameInput.value = '';
                    commitMessageInput.value = 'Ajout d\'un fichier via le site';
                } else {
                    const errorData = await response.json();
                    statusMessage.textContent = `Erreur lors de l'envoi : ${errorData.message || response.statusText}`;
                    statusMessage.className = 'error';
                    console.error('Erreur API GitHub:', errorData);
                }
            } catch (error) {
                statusMessage.textContent = `Une erreur réseau inattendue est survenue : ${error.message}`;
                statusMessage.className = 'error';
                console.error('Erreur fetch:', error);
            }
        };

        reader.onerror = (error) => {
            statusMessage.textContent = `Erreur de lecture du fichier : ${error}`;
            statusMessage.className = 'error';
        };
    });
});
