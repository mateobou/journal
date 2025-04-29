##📄 Google Alerts to Labeled PDF
Un projet complet permettant de centraliser des alertes Google Alerts reçues par email, de filtrer et labelliser les articles pertinents, puis de générer un PDF regroupant tous les contenus automatiquement.

##🚀 Objectif
📩 Récupérer automatiquement les emails contenant des alertes Google.

📰 Extraire et concaténer les articles trouvés.

🏷️ Labelliser chaque article s'il est jugé pertinent.

📄 Générer un PDF final regroupant l'ensemble des articles, prêt à être archivé ou partagé.

##🛠️ Stack technique
Backend : NestJS (Node.js)

Automatisation des flux : n8n

Génération de PDF : Puppeteer

Template HTML/CSS : Handlebars

##🧩 Architecture du projet
n8n : Orchestration des workflows (lecture d'emails, parsing, envoi à l'API).

NestJS : Serveur backend :

API d'ingestion d'articles.

Service de génération de PDF à partir d'un template.

Labellisation des articles pertinents (manuel ou automatique).

PDF Service :

Assemble tous les articles à la suite.

Mise en page professionnelle (format journal/magazine).

Export en un seul fichier PDF.

##📬 Fonctionnement général
n8n récupère les emails d'alerte Google automatiquement via IMAP/POP3.

n8n parse le contenu des emails pour extraire les articles.

n8n appelle l'API NestJS pour stocker temporairement les articles.

NestJS traite les articles :

Vérifie leur pertinence.

Labellise les contenus utiles.

NestJS génère un PDF en concaténant tous les articles labellisés dans un seul fichier.

##📦 Installation
bash
Copy
Edit
# Cloner le projet
git clone https://github.com/ton-projet/google-alerts-to-pdf.git
cd google-alerts-to-pdf

# Installer les dépendances
npm install

# Lancer en développement
npm run start:dev
Configuration
Créer un fichier .env pour configurer :

ini
Copy
Edit
PORT=3003
IMAP_USER=your-email@example.com
IMAP_PASSWORD=your-password
IMAP_HOST=imap.gmail.com
PDF_OUTPUT_PATH=./pdf
🛠️ Démarrer les workflows n8n
Connecter n8n à votre boîte email.

Déployer le workflow :

Lire les nouveaux emails.

Parser le contenu HTML des emails.

Appeler l'endpoint /generate-pdf de votre API NestJS avec les articles extraits.

##📄 Exemple d'appel API
Endpoint : POST /generate-pdf
json
Copy
Edit
{
  "data": [
    {
      "title": "Titre de l'article",
      "subtitle": "Sous-titre",
      "date": "2025-04-27",
      "author": "Nom de l'auteur",
      "content": "Contenu de l'article",
      "name": "Nom pour le PDF",
      "css": "CSS custom optionnel"
    },
    ...
  ]
}
Réponse : un fichier PDF regroupant tous les articles.

##📚 Technologies principales utilisées

Technologie	Usage
NestJS	Serveur API
Puppeteer	Génération de PDF
Handlebars	Templates HTML
n8n	Automatisation des flux emails
##📈 Roadmap
 Extraction basique d'emails Google Alerts

 Concaténation multiple dans un PDF

 Mise en forme personnalisée

 Intelligence de labellisation automatique (basée sur mots-clés / IA)

 Tableau de bord de visualisation des articles collectés

##🤝 Contribuer
Les contributions sont les bienvenues ! Merci de suivre les étapes :

Fork le projet

Crée ta branche (git checkout -b feature/nouvelle-fonctionnalite)

Commit (git commit -m 'Ajout nouvelle fonctionnalité')

Push (git push origin feature/nouvelle-fonctionnalite)

Ouvre une Pull Request

##📄 Licence
Ce projet est sous licence MIT.

##✉️ Contact
Pour toute question :
mateo@letsworktogether.fr