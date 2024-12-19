# 🎭 **Backstage Setup & Usage**

## 📋 **Table des matières**
1. [Introduction](#introduction)
2. [Prérequis](#prérequis)
3. [Installation de Backstage](#installation-de-backstage)
4. [Création d'un template](#création-dun-template)
5. [Ajout d'un service lié à un repo](#ajout-dun-service-lié-à-un-repo)
6. [Plugins utilisés](#plugins-utilisés)

---

## 🚀 **Introduction**

Ce projet met en place un environnement **Backstage** qui inclut :
- La **création d'un template** (non fonctionnel à l'heure actuelle).
- L'ajout d'un **service lié à un dépôt de test**.
- L'intégration de différents plugins (essentiellement axé front-end) 

---

## 🛠️ **Prérequis**

Avant de commencer, assure-toi d'avoir installé les outils suivants :

1. **Node.js** (version ≥ 14.x)
2. **Yarn** (gestionnaire de paquets)
3. **Git** (pour versionner les fichiers)

Tu peux vérifier les versions installées avec :
```bash
node --version
yarn --version
git --version
```
---

## 🏗️ **Installation de Backstage**

1. **Cloner le projet Backstage :**

```bash
git clone https://github.com/AmongCorp/AmogStage.git
cd AmogStage
```

2. **Installer les dépendances avec Yarn :**

```bash
yarn install
```

3. **Démarrer le projet :**

```bash
yarn dev
```

Et vous accederez à l'interface Backstage sur `http://localhost:3000`.

### 📁 Connexion à GitHub

Si vous souhaitez vous connecter à votre compte GitHub, vous devrez créer un fichier à la racine du projet nommé `app-config.local.yaml` et y ajouter les lignes suivantes :

```yaml
auth:
  environment: development
  providers:
    guest: {}
    github:
      development:
        clientId: YOUR_CLIENT_ID
        clientSecret: YOUR_CLIENT_SECRET
        signIn:
          resolvers:
            - resolver: usernameMatchingUserEntityName
```

Pour plus d'informations, consultez la page suivante : [GitHub Auth Provider](https://backstage.io/docs/getting-started/config/authentication).

---

## 📁 **Création d'un template**

Un template permet d'automatiser la création de projets ou de ressources dans Backstage.

Exemple de fichier ``another-template.yaml`` (actuellement inutilisable pour des tests) :

```yaml
apiVersion: scaffolder.backstage.io/v1beta3
kind: Template
metadata:
  name: example-service
  title: Example Service
  description: Crée un exemple de service pour tester Backstage
spec:
  owner: guests
  type: service
  parameters:
    - title: Service Name
      required:
        - name
      properties:
        name:
          type: string
          description: Nom unique du service

  steps:
    - id: fetch-base
      name: Fetch Template
      action: fetch:template
      input:
        url: ./content
        values:
          name: ${{ parameters.name }}
```

Ce template est **non fonctionnel** actuellement mais montre un exemple simple de définition.

---

## 📂 **Ajout d'un service lié à un repo**

Tu peux ajouter manuellement un service pour des tests avec le fichier ``entities.yaml`` :

```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: example-service
  annotations:
    backstage.io/techdocs-ref: dir:.
  description: Service de test pour Backstage
spec:
  type: service
  owner: guests
  lifecycle: experimental
```

---

## 📖 **Plugins utilisés**

### 📜 **Plugin README**

Le plugin README permet d'afficher le contenu d'un fichier `README.md` dans l'interface Backstage.

Vous pouvez l'apercevoir depuis le composant créé par défaut de Backstage.

### 📦 **Plugin TechDocs**

Le plugin TechDocs permet d'afficher la documentation d'un projet dans l'interface Backstage.
Il est assez similaire à README mais permet de gérer des fichiers plus complexes.

A noter que pour le faire fonctionner, vous aurez besoin d'exécuter les commandes suivantes :

```bash
pip install mkdocs
pip install mkdocs-material
pip install mkdocs-material-extensions
pip install mkdocs-techdocs-core
```

Vous pouvez apercevoir le rendu depuis le deuxième composant nommé `infos-backstage`.

### 📊 **Plugin Festive Fun**

Le plugin Festive Fun permet d'afficher des animations de tout genre dans l'interface Backstage.
Vous pouvez le voir en action depuis n'importe quelle page de Backstage.

--- 

📧 **Pour toute question ou suggestion** : *contactez-nous directement via ce repo !*